const { pool } = require('../connection');

class VacancyModel {
  // Get all vacancies
  async getAllVacancies() {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, c.name as company_name, c.logo as company_logo 
        FROM vacancy v
        JOIN company c ON v.company_id = c.id
        WHERE v.is_active = TRUE
        ORDER BY v.created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      throw error;
    }
  }

  // Get vacancy by ID
  async getVacancyById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, c.name as company_name, c.logo as company_logo,
               CONCAT(e.name, ' ', e.surname) as employer_name
        FROM vacancy v
        JOIN company c ON v.company_id = c.id
        JOIN employer e ON v.employer_id = e.id
        WHERE v.id = ?
      `, [id]);
      
      if (rows.length === 0) return null;
      
      const vacancy = rows[0];
      
      // Get required skills
      const [skills] = await pool.query(
        'SELECT * FROM vacancy_required_skill WHERE vacancy_id = ?',
        [id]
      );
      vacancy.required_skills = skills;
      
      // Get employment types
      const [employmentTypes] = await pool.query(`
        SELECT et.* 
        FROM employment_type et
        JOIN vacancy_employment_type vet ON et.id = vet.employment_type_id
        WHERE vet.vacancy_id = ?
      `, [id]);
      vacancy.employment_types = employmentTypes;
      
      // Get work formats
      const [workFormats] = await pool.query(`
        SELECT wf.* 
        FROM work_format wf
        JOIN vacancy_work_format vwf ON wf.id = vwf.work_format_id
        WHERE vwf.vacancy_id = ?
      `, [id]);
      vacancy.work_formats = workFormats;
      
      return vacancy;
    } catch (error) {
      console.error(`Error fetching vacancy with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new vacancy
  async createVacancy(vacancyData) {
    try {
      const { 
        title, company_id, employer_id, description, requirements, 
        responsibilities, salary_min, salary_max, city, is_active = true 
      } = vacancyData;
      
      const [result] = await pool.query(
        `INSERT INTO vacancy 
         (title, company_id, employer_id, description, requirements, responsibilities, 
          salary_min, salary_max, city, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, company_id, employer_id, description, requirements, responsibilities, 
         salary_min, salary_max, city, is_active]
      );
      
      const vacancyId = result.insertId;
      
      // Add employment types if provided
      if (vacancyData.employment_types && Array.isArray(vacancyData.employment_types)) {
        for (const typeId of vacancyData.employment_types) {
          await this.addEmploymentType(vacancyId, typeId);
        }
      }
      
      // Add work formats if provided
      if (vacancyData.work_formats && Array.isArray(vacancyData.work_formats)) {
        for (const formatId of vacancyData.work_formats) {
          await this.addWorkFormat(vacancyId, formatId);
        }
      }
      
      // Add required skills if provided
      if (vacancyData.required_skills && Array.isArray(vacancyData.required_skills)) {
        for (const skill of vacancyData.required_skills) {
          await this.addRequiredSkill(vacancyId, skill.skill_name, skill.min_qualification_level);
        }
      }
      
      return { id: vacancyId, ...vacancyData };
    } catch (error) {
      console.error('Error creating vacancy:', error);
      throw error;
    }
  }

  // Update a vacancy
  async updateVacancy(id, vacancyData) {
    try {
      const { 
        title, description, requirements, responsibilities, 
        salary_min, salary_max, city, is_active 
      } = vacancyData;
      
      await pool.query(
        `UPDATE vacancy 
         SET title = ?, description = ?, requirements = ?, responsibilities = ?, 
             salary_min = ?, salary_max = ?, city = ?, is_active = ?
         WHERE id = ?`,
        [title, description, requirements, responsibilities, 
         salary_min, salary_max, city, is_active, id]
      );
      
      // Update employment types if provided
      if (vacancyData.employment_types && Array.isArray(vacancyData.employment_types)) {
        // Delete existing employment types
        await pool.query('DELETE FROM vacancy_employment_type WHERE vacancy_id = ?', [id]);
        
        // Add new employment types
        for (const typeId of vacancyData.employment_types) {
          await this.addEmploymentType(id, typeId);
        }
      }
      
      // Update work formats if provided
      if (vacancyData.work_formats && Array.isArray(vacancyData.work_formats)) {
        // Delete existing work formats
        await pool.query('DELETE FROM vacancy_work_format WHERE vacancy_id = ?', [id]);
        
        // Add new work formats
        for (const formatId of vacancyData.work_formats) {
          await this.addWorkFormat(id, formatId);
        }
      }
      
      // Update required skills if provided
      if (vacancyData.required_skills && Array.isArray(vacancyData.required_skills)) {
        // Delete existing required skills
        await pool.query('DELETE FROM vacancy_required_skill WHERE vacancy_id = ?', [id]);
        
        // Add new required skills
        for (const skill of vacancyData.required_skills) {
          await this.addRequiredSkill(id, skill.skill_name, skill.min_qualification_level);
        }
      }
      
      return { id, ...vacancyData };
    } catch (error) {
      console.error(`Error updating vacancy with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a vacancy
  async deleteVacancy(id) {
    try {
      await pool.query('DELETE FROM vacancy WHERE id = ?', [id]);
      return { success: true, message: `Vacancy with ID ${id} deleted successfully` };
    } catch (error) {
      console.error(`Error deleting vacancy with ID ${id}:`, error);
      throw error;
    }
  }

  // Add an employment type to a vacancy
  async addEmploymentType(vacancyId, employmentTypeId) {
    try {
      await pool.query(
        'INSERT INTO vacancy_employment_type (vacancy_id, employment_type_id) VALUES (?, ?)',
        [vacancyId, employmentTypeId]
      );
      return { success: true };
    } catch (error) {
      console.error(`Error adding employment type to vacancy ${vacancyId}:`, error);
      throw error;
    }
  }

  // Add a work format to a vacancy
  async addWorkFormat(vacancyId, workFormatId) {
    try {
      await pool.query(
        'INSERT INTO vacancy_work_format (vacancy_id, work_format_id) VALUES (?, ?)',
        [vacancyId, workFormatId]
      );
      return { success: true };
    } catch (error) {
      console.error(`Error adding work format to vacancy ${vacancyId}:`, error);
      throw error;
    }
  }

  // Add a required skill to a vacancy
  async addRequiredSkill(vacancyId, skillName, minQualificationLevel) {
    try {
      await pool.query(
        'INSERT INTO vacancy_required_skill (vacancy_id, skill_name, min_qualification_level) VALUES (?, ?, ?)',
        [vacancyId, skillName, minQualificationLevel]
      );
      return { success: true };
    } catch (error) {
      console.error(`Error adding required skill to vacancy ${vacancyId}:`, error);
      throw error;
    }
  }

  // Search vacancies by criteria
  async searchVacancies(criteria) {
    try {
      let query = `
        SELECT v.*, c.name as company_name, c.logo as company_logo 
        FROM vacancy v
        JOIN company c ON v.company_id = c.id
        WHERE v.is_active = TRUE
      `;
      
      const params = [];
      
      // Add search term filter
      if (criteria.searchTerm) {
        query += ` AND (v.title LIKE ? OR v.description LIKE ? OR c.name LIKE ?)`;
        const searchPattern = `%${criteria.searchTerm}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }
      
      // Add city filter
      if (criteria.city) {
        query += ` AND v.city = ?`;
        params.push(criteria.city);
      }
      
      // Add salary filter
      if (criteria.minSalary) {
        query += ` AND (v.salary_max >= ? OR v.salary_min >= ?)`;
        params.push(criteria.minSalary, criteria.minSalary);
      }
      
      // Add employment type filter
      if (criteria.employmentTypeId) {
        query += ` AND v.id IN (SELECT vacancy_id FROM vacancy_employment_type WHERE employment_type_id = ?)`;
        params.push(criteria.employmentTypeId);
      }
      
      // Add work format filter
      if (criteria.workFormatId) {
        query += ` AND v.id IN (SELECT vacancy_id FROM vacancy_work_format WHERE work_format_id = ?)`;
        params.push(criteria.workFormatId);
      }
      
      // Add skill filter
      if (criteria.skillName) {
        query += ` AND v.id IN (SELECT vacancy_id FROM vacancy_required_skill WHERE skill_name LIKE ?)`;
        params.push(`%${criteria.skillName}%`);
      }
      
      // Add sorting
      query += ` ORDER BY v.created_at DESC`;
      
      // Add pagination
      if (criteria.limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(criteria.limit));
        
        if (criteria.offset) {
          query += ` OFFSET ?`;
          params.push(parseInt(criteria.offset));
        }
      }
      
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error searching vacancies:', error);
      throw error;
    }
  }

  // Get vacancies by company
  async getVacanciesByCompany(companyId) {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, c.name as company_name, c.logo as company_logo 
        FROM vacancy v
        JOIN company c ON v.company_id = c.id
        WHERE v.company_id = ? AND v.is_active = TRUE
        ORDER BY v.created_at DESC
      `, [companyId]);
      return rows;
    } catch (error) {
      console.error(`Error fetching vacancies for company ${companyId}:`, error);
      throw error;
    }
  }

  // Get vacancies by employer
  async getVacanciesByEmployer(employerId) {
    try {
      const [rows] = await pool.query(`
        SELECT v.*, c.name as company_name, c.logo as company_logo 
        FROM vacancy v
        JOIN company c ON v.company_id = c.id
        WHERE v.employer_id = ?
        ORDER BY v.is_active DESC, v.created_at DESC
      `, [employerId]);
      return rows;
    } catch (error) {
      console.error(`Error fetching vacancies for employer ${employerId}:`, error);
      throw error;
    }
  }

  // Get all employment types
  async getAllEmploymentTypes() {
    try {
      const [rows] = await pool.query('SELECT * FROM employment_type');
      return rows;
    } catch (error) {
      console.error('Error fetching employment types:', error);
      throw error;
    }
  }

  // Get all work formats
  async getAllWorkFormats() {
    try {
      const [rows] = await pool.query('SELECT * FROM work_format');
      return rows;
    } catch (error) {
      console.error('Error fetching work formats:', error);
      throw error;
    }
  }
}

module.exports = new VacancyModel();
