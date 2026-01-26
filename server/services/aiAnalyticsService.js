const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

class AIAnalyticsService {
  // Analyze student-job match using AI-like scoring
  async analyzeJobMatch(studentId, jobId) {
    try {
      const student = await User.findById(studentId);
      const job = await Job.findById(jobId);

      if (!student || !job) {
        throw new Error('Student or job not found');
      }

      const analysis = {
        skillsMatch: this.calculateSkillsMatch(student.profile.skills || [], job.requirements.skills || []),
        qualificationMatch: this.calculateQualificationMatch(student.profile, job.requirements),
        experienceMatch: this.calculateExperienceMatch(student.profile, job.requirements),
        overallScore: 0,
        recommendations: []
      };

      // Calculate overall score (weighted average)
      analysis.overallScore = Math.round(
        (analysis.skillsMatch * 0.5) +
        (analysis.qualificationMatch * 0.3) +
        (analysis.experienceMatch * 0.2)
      );

      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis, student.profile, job);

      return analysis;
    } catch (error) {
      console.error('Error in AI analysis:', error);
      throw error;
    }
  }

  // Calculate skills match percentage
  calculateSkillsMatch(studentSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 100;
    if (!studentSkills || studentSkills.length === 0) return 0;

    const normalizedStudentSkills = studentSkills.map(s => s.toLowerCase());
    const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase());

    const matchedSkills = normalizedRequiredSkills.filter(skill =>
      normalizedStudentSkills.some(studentSkill => 
        studentSkill.includes(skill) || skill.includes(studentSkill)
      )
    );

    return Math.round((matchedSkills.length / normalizedRequiredSkills.length) * 100);
  }

  // Calculate qualification match
  calculateQualificationMatch(profile, requirements) {
    let score = 50; // Base score

    // Check CGPA
    if (requirements.minCGPA && profile.cgpa) {
      if (profile.cgpa >= requirements.minCGPA) {
        score += 30;
      } else if (profile.cgpa >= requirements.minCGPA - 0.5) {
        score += 15;
      }
    } else {
      score += 30; // If no CGPA requirement, give full score
    }

    // Check education level
    if (requirements.education && profile.department) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  // Calculate experience match
  calculateExperienceMatch(profile, requirements) {
    // For students, experience might not be a strong factor
    // This is a simplified version
    if (!requirements.experience || requirements.experience.includes('0')) {
      return 100;
    }
    return 60; // Default moderate score
  }

  // Generate personalized recommendations
  generateRecommendations(analysis, profile, job) {
    const recommendations = [];

    if (analysis.skillsMatch < 70) {
      const missingSkills = job.requirements.skills?.filter(skill =>
        !(profile.skills || []).some(s => s.toLowerCase().includes(skill.toLowerCase()))
      ) || [];
      
      if (missingSkills.length > 0) {
        recommendations.push(`Improve your skills in: ${missingSkills.join(', ')}`);
      }
    }

    if (analysis.qualificationMatch < 70) {
      if (job.requirements.minCGPA && profile.cgpa < job.requirements.minCGPA) {
        recommendations.push('Focus on improving your CGPA to meet the minimum requirement');
      }
    }

    if (analysis.overallScore >= 80) {
      recommendations.push('Excellent match! You should definitely apply for this position');
    } else if (analysis.overallScore >= 60) {
      recommendations.push('Good match! Consider highlighting relevant projects in your application');
    } else if (analysis.overallScore >= 40) {
      recommendations.push('Moderate match. Focus on bridging skill gaps before applying');
    } else {
      recommendations.push('This position may be challenging. Consider upskilling or looking for more suitable roles');
    }

    return recommendations;
  }

  // Generate placement analytics report
  async generatePlacementReport(filters = {}) {
    try {
      const { startDate, endDate, department } = filters;

      const query = {};
      if (startDate || endDate) {
        query.appliedAt = {};
        if (startDate) query.appliedAt.$gte = new Date(startDate);
        if (endDate) query.appliedAt.$lte = new Date(endDate);
      }

      const applications = await Application.find(query)
        .populate('student', 'name profile')
        .populate('job', 'title company type');

      // Filter by department if specified
      let filteredApplications = applications;
      if (department) {
        filteredApplications = applications.filter(app =>
          app.student.profile?.department === department
        );
      }

      const report = {
        summary: {
          totalApplications: filteredApplications.length,
          selected: filteredApplications.filter(a => a.status === 'selected').length,
          rejected: filteredApplications.filter(a => a.status === 'rejected').length,
          pending: filteredApplications.filter(a => a.status === 'applied' || a.status === 'shortlisted').length,
          interviewScheduled: filteredApplications.filter(a => a.status === 'interview-scheduled').length
        },
        avgAIScore: 0,
        topCompanies: {},
        applicationsByType: {
          internship: 0,
          'full-time': 0,
          'part-time': 0,
          contract: 0
        },
        monthlyTrend: {}
      };

      // Calculate average AI score
      const scoredApplications = filteredApplications.filter(a => a.aiScore);
      if (scoredApplications.length > 0) {
        report.avgAIScore = Math.round(
          scoredApplications.reduce((sum, a) => sum + a.aiScore, 0) / scoredApplications.length
        );
      }

      // Top companies
      filteredApplications.forEach(app => {
        const company = app.job?.company || 'Unknown';
        report.topCompanies[company] = (report.topCompanies[company] || 0) + 1;
      });

      // Applications by type
      filteredApplications.forEach(app => {
        const type = app.job?.type || 'full-time';
        report.applicationsByType[type] = (report.applicationsByType[type] || 0) + 1;
      });

      // Monthly trend
      filteredApplications.forEach(app => {
        const month = new Date(app.appliedAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        report.monthlyTrend[month] = (report.monthlyTrend[month] || 0) + 1;
      });

      return report;
    } catch (error) {
      console.error('Error generating placement report:', error);
      throw error;
    }
  }

  // Get student insights
  async getStudentInsights(studentId) {
    try {
      const student = await User.findById(studentId);
      const applications = await Application.find({ student: studentId })
        .populate('job', 'title company type requirements');

      const insights = {
        applicationStats: {
          total: applications.length,
          selected: applications.filter(a => a.status === 'selected').length,
          rejected: applications.filter(a => a.status === 'rejected').length,
          pending: applications.filter(a => ['applied', 'shortlisted', 'interview-scheduled'].includes(a.status)).length
        },
        avgMatchScore: 0,
        strongSkills: [],
        improvementAreas: [],
        recommendations: []
      };

      // Calculate average match score
      const scoredApps = applications.filter(a => a.aiScore);
      if (scoredApps.length > 0) {
        insights.avgMatchScore = Math.round(
          scoredApps.reduce((sum, a) => sum + a.aiScore, 0) / scoredApps.length
        );
      }

      // Identify strong skills and improvement areas
      const allRequiredSkills = {};
      applications.forEach(app => {
        app.job?.requirements?.skills?.forEach(skill => {
          allRequiredSkills[skill] = (allRequiredSkills[skill] || 0) + 1;
        });
      });

      const studentSkills = (student.profile?.skills || []).map(s => s.toLowerCase());
      Object.keys(allRequiredSkills).forEach(skill => {
        if (studentSkills.some(s => s.includes(skill.toLowerCase()))) {
          insights.strongSkills.push(skill);
        } else if (allRequiredSkills[skill] >= 2) {
          insights.improvementAreas.push(skill);
        }
      });

      // Generate recommendations
      if (insights.avgMatchScore < 60) {
        insights.recommendations.push('Focus on improving skill alignment with job requirements');
      }
      if (insights.improvementAreas.length > 0) {
        insights.recommendations.push(`Consider learning: ${insights.improvementAreas.slice(0, 3).join(', ')}`);
      }
      if (insights.applicationStats.rejected > insights.applicationStats.selected && insights.applicationStats.rejected > 3) {
        insights.recommendations.push('Review and update your resume/cover letter based on job requirements');
      }

      return insights;
    } catch (error) {
      console.error('Error generating student insights:', error);
      throw error;
    }
  }
}

module.exports = new AIAnalyticsService();
