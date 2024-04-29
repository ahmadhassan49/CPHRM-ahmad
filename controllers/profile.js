const { User, UserProfile, Employment } = require('../models/index');

const Userprofile = async (req, res) => {
    if (req.method === 'GET') {
        res.redirect('alluser');
    } else if (req.method === 'POST') {
        try {
            const { userId } = req.body;
            const user = await User.findByPk(userId);
            if (user) {
                const department = await user.findDepartmentById(user.department_id);
                const role = await user.findRoleById(user.role_id);
                const user_profile = await UserProfile.findOne({where: {user_id: user.id}});
                const status = await Employment.findOne({where: {id: user.employment_id}});
                const fullname = await user.getFullName();
                res.render('admin', { user, department, role, fullname, user_profile, status });
            }
        } catch (error) {
            console.error('Error fetching departments and roles:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

const profile = async (req,res) => {
    await res.render('profile');
};

const saveUserProfile = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const {
                userId,
                father_name,
                phone,
                dob,
                religion,
                nationality,
                cnic,
                gender,
                address,
                designation,
                line_manager,
                per_email,
                doj,
                salary,
            } = req.body;

            let userProfile = await UserProfile.findOne({ where: { user_id: userId } });

            if (userProfile) {
                await UserProfile.update({
                    father_name,
                    phone,
                    dob,
                    religion,
                    nationality,
                    cnic,
                    gender,
                    address,
                    designation,
                    line_manager,
                    per_email,
                    doj,
                    salary,
                });
            }

            res.status(200).send({ message: 'User profile saved successfully' });
        } catch (error) {
            console.error('Error saving user profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

module.exports = { profile, Userprofile, saveUserProfile };
