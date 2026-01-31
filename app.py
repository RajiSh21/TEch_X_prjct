#!/usr/bin/env python3
"""
Placement App - Web application for managing placement and internship opportunities
Integrates with the Selenium job scraper to display scraped data
"""

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import sys

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///placement_opportunities.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)


# Database Models
class JobOpportunity(db.Model):
    """Model for storing job opportunities (placements and internships)"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    link = db.Column(db.String(500), nullable=False)
    job_type = db.Column(db.String(50), nullable=False)  # 'placement' or 'internship'
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<JobOpportunity {self.title} at {self.company}>'
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'link': self.link,
            'job_type': self.job_type,
            'date_added': self.date_added.strftime('%Y-%m-%d %H:%M:%S'),
            'is_active': self.is_active
        }


# Routes
@app.route('/')
def index():
    """Home page"""
    placement_count = JobOpportunity.query.filter_by(job_type='placement', is_active=True).count()
    internship_count = JobOpportunity.query.filter_by(job_type='internship', is_active=True).count()
    total_count = placement_count + internship_count
    
    recent_jobs = JobOpportunity.query.filter_by(is_active=True).order_by(
        JobOpportunity.date_added.desc()
    ).limit(5).all()
    
    return render_template('index.html',
                         placement_count=placement_count,
                         internship_count=internship_count,
                         total_count=total_count,
                         recent_jobs=recent_jobs)


@app.route('/placements')
def placements():
    """View all placement opportunities"""
    page = request.args.get('page', 1, type=int)
    per_page = 20
    
    placements = JobOpportunity.query.filter_by(
        job_type='placement',
        is_active=True
    ).order_by(JobOpportunity.date_added.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return render_template('placements.html', jobs=placements)


@app.route('/internships')
def internships():
    """View all internship opportunities"""
    page = request.args.get('page', 1, type=int)
    per_page = 20
    
    internships = JobOpportunity.query.filter_by(
        job_type='internship',
        is_active=True
    ).order_by(JobOpportunity.date_added.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return render_template('internships.html', jobs=internships)


@app.route('/scrape', methods=['GET', 'POST'])
def scrape():
    """Scrape job opportunities"""
    if request.method == 'POST':
        search_query = request.form.get('search_query', 'Software Engineer')
        location = request.form.get('location', 'United States')
        job_type = request.form.get('job_type', 'placement')
        num_pages = int(request.form.get('num_pages', 1))
        
        try:
            # Import and run the scraper
            from job_scraper_integration import scrape_and_store_jobs
            
            count = scrape_and_store_jobs(
                search_query=search_query,
                location=location,
                job_type=job_type,
                num_pages=num_pages
            )
            
            flash(f'Successfully scraped and added {count} new job opportunities!', 'success')
            
            if job_type == 'internship':
                return redirect(url_for('internships'))
            else:
                return redirect(url_for('placements'))
                
        except Exception as e:
            flash(f'Error during scraping: {str(e)}', 'error')
            return redirect(url_for('scrape'))
    
    return render_template('scrape.html')


@app.route('/job/<int:job_id>')
def job_detail(job_id):
    """View job details"""
    job = JobOpportunity.query.get_or_404(job_id)
    return render_template('job_detail.html', job=job)


@app.route('/api/jobs')
def api_jobs():
    """API endpoint to get jobs as JSON"""
    job_type = request.args.get('type', None)
    
    query = JobOpportunity.query.filter_by(is_active=True)
    
    if job_type:
        query = query.filter_by(job_type=job_type)
    
    jobs = query.order_by(JobOpportunity.date_added.desc()).limit(100).all()
    
    return jsonify({
        'count': len(jobs),
        'jobs': [job.to_dict() for job in jobs]
    })


@app.route('/delete/<int:job_id>', methods=['POST'])
def delete_job(job_id):
    """Delete (deactivate) a job opportunity"""
    job = JobOpportunity.query.get_or_404(job_id)
    job.is_active = False
    db.session.commit()
    flash('Job opportunity removed successfully!', 'success')
    
    if job.job_type == 'internship':
        return redirect(url_for('internships'))
    else:
        return redirect(url_for('placements'))


@app.route('/clear-all', methods=['POST'])
def clear_all():
    """Clear all job opportunities"""
    job_type = request.form.get('job_type', None)
    
    if job_type:
        JobOpportunity.query.filter_by(job_type=job_type).update({'is_active': False})
    else:
        JobOpportunity.query.update({'is_active': False})
    
    db.session.commit()
    flash('All job opportunities cleared!', 'success')
    return redirect(url_for('index'))


# Initialize database
def init_db():
    """Initialize the database"""
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")


if __name__ == '__main__':
    # Initialize database if it doesn't exist
    if not os.path.exists('placement_opportunities.db'):
        init_db()
    
    # Run the app
    print("\n" + "=" * 70)
    print("PLACEMENT & INTERNSHIP OPPORTUNITIES APP")
    print("=" * 70)
    print("\nStarting Flask application...")
    print("Access the app at: http://127.0.0.1:5000")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
