const { sequelize, Department, Role } = require('../models/index');


const role = async (req, res) => {
    try {
        const alldept = await Department.findAll();
        let alldeptname = [];
        if (Array.isArray(alldept)) {
            alldeptname = alldept.map(deptdata => deptdata.name);
        } else {
            console.error('Department data is not an array:', alldept);
        }
        await res.render('role', { alldeptname });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).send('Internal Server Error');
    }
};


const adddepts = async (req, res) => {
    const dept_input = req.body.department;
    const role_input = req.body.role;

    let combined_input;

    if (role_input.toLowerCase().includes('manager')) {
        combined_input = `${dept_input} - ${role_input}`;
    } else {
        combined_input = role_input;
    }

    try {
        let department = await Department.findOne({ where: { name: dept_input } });

        if (!department) {
            await sequelize.transaction(async (t) => {
                department = await Department.create({ name: dept_input }, { transaction: t });

                await Role.create({ name: combined_input, department_id: department.id }, { transaction: t });
            });
        } else {
            const role = await Role.findOne({ where: { name: combined_input, department_id: department.id } });

            if (!role) {
                await Role.create({ name: combined_input, department_id: department.id });
            }
        }

        res.redirect('/role');
    } catch (error) {
        console.error('Error adding department and role:', error);
        res.status(500).send('Internal Server Error');
    }
};

const addrole = async (req, res) => {
    var dept_input = req.body.department;
    var role_input = req.body.role;
    try {
        const isrole = await Role.findOne({where: {name: role_input}});
        if (!isrole) {
            var data = await Department.findOne({where: {name: dept_input}});
            await Role.create({name: role_input, department_id: data.id});
        }
        await res.redirect('/role');
    } catch (error) {
        console.log(error);
    }
};
module.exports = {role, addrole, adddepts};
