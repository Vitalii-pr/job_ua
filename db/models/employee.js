const { pool } = require('../connection');

class EmployeeModel {
  // Get all employees
  async getAllEmployees() {
    try {
      const [rows] = await pool.query('SELECT * FROM employee');
      return rows;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  // Get employee by ID
  async getEmployeeById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new employee
  async createEmployee(employeeData) {
    try {
      const { email, photo, name, surname, bio, position, qualification, english_lvl, resume, portfolio, city } = employeeData;
      
      const [result] = await pool.query(
        'INSERT INTO employee (email, photo, name, surname, bio, position, qualification, english_lvl, resume, portfolio, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [email, photo, name, surname, bio, position, qualification, english_lvl, resume, portfolio, city]
      );
      
      return { id: result.insertId, ...employeeData };
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  // Update an employee
  async updateEmployee(id, employeeData) {
    try {
      const { email, photo, name, surname, bio, position, qualification, english_lvl, resume, portfolio, city } = employeeData;
      
      await pool.query(
        'UPDATE employee SET email = ?, photo = ?, name = ?, surname = ?, bio = ?, position = ?, qualification = ?, english_lvl = ?, resume = ?, portfolio = ?, city = ? WHERE id = ?',
        [email, photo, name, surname, bio, position, qualification, english_lvl, resume, portfolio, city, id]
      );
      
      return { id, ...employeeData };
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete an employee
  async deleteEmployee(id) {
    try {
      await pool.query('DELETE FROM employee WHERE id = ?', [id]);
      return { success: true, message: `Employee with ID ${id} deleted successfully` };
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw error;
    }
  }

  // Add a skill to an employee
  async addSkill(employeeId, skillName, qualificationLevel) {
    try {
      await pool.query(
        'INSERT INTO employee_skill (employee_id, skill_name, qualification_level) VALUES (?, ?, ?)',
        [employeeId, skillName, qualificationLevel]
      );
      return { success: true, message: `Skill ${skillName} added to employee ${employeeId}` };
    } catch (error) {
      console.error(`Error adding skill to employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get all skills for an employee
  async getSkills(employeeId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM employee_skill WHERE employee_id = ?',
        [employeeId]
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching skills for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Add a goal to an employee
  async addGoal(employeeId, goalDescription) {
    try {
      await pool.query(
        'INSERT INTO employee_goal (employee_id, goal_description) VALUES (?, ?)',
        [employeeId, goalDescription]
      );
      return { success: true, message: `Goal added to employee ${employeeId}` };
    } catch (error) {
      console.error(`Error adding goal to employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get all goals for an employee
  async getGoals(employeeId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM employee_goal WHERE employee_id = ?',
        [employeeId]
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching goals for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Add a past project to an employee
  async addPastProject(employeeId, projectData) {
    try {
      const { project_name, project_description, start_date, end_date } = projectData;
      
      const [result] = await pool.query(
        'INSERT INTO past_project (employee_id, project_name, project_description, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
        [employeeId, project_name, project_description, start_date, end_date]
      );
      
      return { id: result.insertId, employee_id: employeeId, ...projectData };
    } catch (error) {
      console.error(`Error adding past project to employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get all past projects for an employee
  async getPastProjects(employeeId) {
    try {
      const [projects] = await pool.query(
        'SELECT * FROM past_project WHERE employee_id = ?',
        [employeeId]
      );
      
      // For each project, get its roles
      for (let project of projects) {
        const [roles] = await pool.query(
          'SELECT * FROM past_role WHERE project_id = ?',
          [project.id]
        );
        project.roles = roles;
      }
      
      return projects;
    } catch (error) {
      console.error(`Error fetching past projects for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Add a role to a past project
  async addPastRole(projectId, roleData) {
    try {
      const { role_name, role_description } = roleData;
      
      const [result] = await pool.query(
        'INSERT INTO past_role (project_id, role_name, role_description) VALUES (?, ?, ?)',
        [projectId, role_name, role_description]
      );
      
      return { id: result.insertId, project_id: projectId, ...roleData };
    } catch (error) {
      console.error(`Error adding past role to project ${projectId}:`, error);
      throw error;
    }
  }

  // Add employment type preference for an employee
  async addEmploymentTypePreference(employeeId, employmentTypeId) {
    try {
      await pool.query(
        'INSERT INTO employee_employment_type (employee_id, employment_type_id) VALUES (?, ?)',
        [employeeId, employmentTypeId]
      );
      return { success: true, message: `Employment type preference added to employee ${employeeId}` };
    } catch (error) {
      console.error(`Error adding employment type preference to employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get all employment type preferences for an employee
  async getEmploymentTypePreferences(employeeId) {
    try {
      const [rows] = await pool.query(
        'SELECT et.* FROM employment_type et JOIN employee_employment_type eet ON et.id = eet.employment_type_id WHERE eet.employee_id = ?',
        [employeeId]
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching employment type preferences for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Add work format preference for an employee
  async addWorkFormatPreference(employeeId, workFormatId) {
    try {
      await pool.query(
        'INSERT INTO employee_work_format (employee_id, work_format_id) VALUES (?, ?)',
        [employeeId, workFormatId]
      );
      return { success: true, message: `Work format preference added to employee ${employeeId}` };
    } catch (error) {
      console.error(`Error adding work format preference to employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get all work format preferences for an employee
  async getWorkFormatPreferences(employeeId) {
    try {
      const [rows] = await pool.query(
        'SELECT wf.* FROM work_format wf JOIN employee_work_format ewf ON wf.id = ewf.work_format_id WHERE ewf.employee_id = ?',
        [employeeId]
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching work format preferences for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Add a disliked vacancy for an employee
  async addDislikedVacancy(employeeId, vacancyId) {
    try {
      await pool.query(
        'INSERT INTO employee_disliked_vacancy (employee_id, vacancy_id) VALUES (?, ?)',
        [employeeId, vacancyId]
      );
      return { success: true, message: `Vacancy ${vacancyId} added to disliked list for employee ${employeeId}` };
    } catch (error) {
      console.error(`Error adding disliked vacancy for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get all disliked vacancies for an employee
  async getDislikedVacancies(employeeId) {
    try {
      const [rows] = await pool.query(
        'SELECT v.* FROM vacancy v JOIN employee_disliked_vacancy edv ON v.id = edv.vacancy_id WHERE edv.employee_id = ?',
        [employeeId]
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching disliked vacancies for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Add a liked material for an employee
  async addLikedMaterial(employeeId, materialId) {
    try {
      await pool.query(
        'INSERT INTO employee_liked_material (employee_id, material_id) VALUES (?, ?)',
        [employeeId, materialId]
      );
      return { success: true, message: `Material ${materialId} added to liked list for employee ${employeeId}` };
    } catch (error) {
      console.error(`Error adding liked material for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get all liked materials for an employee
  async getLikedMaterials(employeeId) {
    try {
      const [rows] = await pool.query(
        'SELECT m.* FROM material m JOIN employee_liked_material elm ON m.id = elm.material_id WHERE elm.employee_id = ?',
        [employeeId]
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching liked materials for employee ${employeeId}:`, error);
      throw error;
    }
  }

  // Get complete employee profile with all related data
  async getCompleteProfile(employeeId) {
    try {
      // Get basic employee info
      const employee = await this.getEmployeeById(employeeId);
      if (!employee) return null;
      
      // Get skills
      employee.skills = await this.getSkills(employeeId);
      
      // Get goals
      employee.goals = await this.getGoals(employeeId);
      
      // Get past projects with roles
      employee.past_projects = await this.getPastProjects(employeeId);
      
      // Get employment type preferences
      employee.employment_types = await this.getEmploymentTypePreferences(employeeId);
      
      // Get work format preferences
      employee.work_formats = await this.getWorkFormatPreferences(employeeId);
      
      // Get disliked vacancies
      employee.disliked_vacancies = await this.getDislikedVacancies(employeeId);
      
      // Get liked materials
      employee.liked_materials = await this.getLikedMaterials(employeeId);
      
      return employee;
    } catch (error) {
      console.error(`Error fetching complete profile for employee ${employeeId}:`, error);
      throw error;
    }
  }
}

module.exports = new EmployeeModel();
