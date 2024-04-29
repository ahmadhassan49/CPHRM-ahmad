const { sequelize, User, Department, Role, UserProfile } = require('../models/index');

const alluser = async (req, res) => {
    try {
        // Find all users excluding admin users
        const users = await User.findAll({
            where: {
                is_admin: false,
            },
            include: [
                { model: Department,
                    as: 'user_department'
                },
                { model: UserProfile,
                    as: 'profile'
                },
                { model: Role,
                    as: 'user_role'
                },
            ],
        });

        // Separate users with and without profiles
        const usersWithProfile = [];
        const usersWithoutProfile = [];

        for (const user of users) {
            const fullName = await user.getFullName();
            const department = user.user_department  ? user.user_department.name : '';
            const role = user.user_role ? user.user_role.name : '';
            const designation = user.profile ? user.profile.designation : '';

            const userData = {
                id: user.id,
                email: user.email,
                department_name: department,
                role_name: role,
                full_name: fullName,
                designation: designation,
            };

            if (user.profile.fatherName && user.profile.doj) {
                usersWithProfile.push(userData);
            } else {
                usersWithoutProfile.push(userData);
            }
        }

        res.render('alluser', { usersWithProfile, usersWithoutProfile });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { alluser };
