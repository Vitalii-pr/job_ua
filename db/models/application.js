const { pool } = require('../connection');

class ApplicationModel {
  // Get all applications
  async getAllApplications() {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, 
               CONCAT(e.name, ' ', e.surname) as employee_name,
               v.title as vacancy_title,
               c.name as company_name
        FROM application a
        JOIN employee e ON a.employee_id = e.id
        JOIN vacancy v ON a.vacancy_id = v.id
        JOIN company c ON v.company_id = c.id
        ORDER BY a.created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  // Get application by ID
  async getApplicationById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, 
               CONCAT(e.name, ' ', e.surname) as employee_name,
               v.title as vacancy_title,
               c.name as company_name
        FROM application a
        JOIN employee e ON a.employee_id = e.id
        JOIN vacancy v ON a.vacancy_id = v.id
        JOIN company c ON v.company_id = c.id
        WHERE a.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching application with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new application
  async createApplication(applicationData) {
    try {
      const { employee_id, vacancy_id, cover_letter } = applicationData;
      
      const [result] = await pool.query(
        'INSERT INTO application (employee_id, vacancy_id, cover_letter) VALUES (?, ?, ?)',
        [employee_id, vacancy_id, cover_letter]
      );
      
      return { id: result.insertId, ...applicationData, status: 'Pending' };
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  // Update an application status
  async updateApplicationStatus(id, status) {
    try {
      await pool.query(
        'UPDATE application SET status = ? WHERE id = ?',
        [status, id]
      );
      
      return { id, status };
    } catch (error) {
      console.error(`Error updating application status for ID ${id}:`, error);
      throw error;
    }
  }

  // Delete an application
  async deleteApplication(id) {
    try {
      await pool.query('DELETE FROM application WHERE id = ?', [id]);
      return { success: true, message: `Application with ID ${id} deleted successfully` };
    } catch (error) {
      console.error(`Error deleting application with ID ${id}:`, error);
      throw error;
    }
  }

  // Get applications by employee
  async getApplicationsByEmployee(employeeId) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, 
               v.title as vacancy_title,
               c.name as company_name,
               c.logo as company_logo
        FROM application a
        JOIN vacancy v ON a.vacancy_id = v.id
        JOIN company c ON v.company_id = c.id
        WHERE a.employee_id = ?
        ORDER BY a.created_at DESC
      `, [employeeId]);
      return rows;
    } catch (error) {
      console.error(`Error fetching applications for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get applications by vacancy
  async getApplicationsByVacancy(vacancyId) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, 
               CONCAT(e.name, ' ', e.surname) as employee_name,
               e.photo as employee_photo,
               e.position as employee_position
        FROM application a
        JOIN employee e ON a.employee_id = e.id
        WHERE a.vacancy_id = ?
        ORDER BY a.created_at DESC
      `, [vacancyId]);
      return rows;
    } catch (error) {
      console.error(`Error fetching applications for vacancy ${vacancyId}:`, error);
      throw error;
    }
  }

  // Get applications by employer (all applications for vacancies posted by this employer)
  async getApplicationsByEmployer(employerId) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, 
               CONCAT(e.name, ' ', e.surname) as employee_name,
               e.photo as employee_photo,
               v.title as vacancy_title
        FROM application a
        JOIN employee e ON a.employee_id = e.id
        JOIN vacancy v ON a.vacancy_id = v.id
        WHERE v.employer_id = ?
        ORDER BY a.created_at DESC
      `, [employerId]);
      return rows;
    } catch (error) {
      console.error(`Error fetching applications for employer ${employerId}:`, error);
      throw error;
    }
  }

  // Check if employee has already applied to a vacancy
  async hasApplied(employeeId, vacancyId) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM application WHERE employee_id = ? AND vacancy_id = ?',
        [employeeId, vacancyId]
      );
      return rows[0].count > 0;
    } catch (error) {
      console.error(`Error checking if employee ${employeeId} has applied to vacancy ${vacancyId}:`, error);
      throw error;
    }
  }

  // Get application statistics for an employer
  async getEmployerStatistics(employerId) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          COUNT(*) as total_applications,
          SUM(CASE WHEN a.status = 'Pending' THEN 1 ELSE 0 END) as pending_applications,
          SUM(CASE WHEN a.status = 'Reviewed' THEN 1 ELSE 0 END) as reviewed_applications,
          SUM(CASE WHEN a.status = 'Interview' THEN 1 ELSE 0 END) as interview_applications,
          SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END) as rejected_applications,
          SUM(CASE WHEN a.status = 'Accepted' THEN 1 ELSE 0 END) as accepted_applications
        FROM application a
        JOIN vacancy v ON a.vacancy_id = v.id
        WHERE v.employer_id = ?
      `, [employerId]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching application statistics for employer ${employerId}:`, error);
      throw error;
    }
  }
}

module.exports = new ApplicationModel();
