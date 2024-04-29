const { User, Department, Role, UserProfile, Employment } = require('../models/index');

const login = async (req, res) => {
    if (req.method === 'GET') {
        if (req.session && req.session.user) {
            return res.redirect('/dashboard');
        } else {
            return res.render('login');
        }
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        const role = await user.findRoleById(user.role_id);

        const fullName = await user.getFullName();
        if (password === user.password) {
            req.session.user = {
                ...user.toJSON(),
                role: role ? role.name : 'Unknown Role',
                fullName: fullName || 'No Name'
            };
            delete req.session.user.password;
            await req.session.save();
            res.redirect('/dashboard');
        } else {
            return res.status(401).send({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const dashboard = async (req, res) => {
    try {
        const user = req.session.user;
        const userData = await User.findOne({
            where: { id: user.id },
            include: [
                {
                    model: UserProfile,
                    as: 'profile'
                },
                {
                    model: Role,
                    as: 'user_role'
                },
                {
                    model: Department,
                    as: 'user_department'
                },
                {
                    model: Employment,
                    as: 'employmentStatus'
                }
            ]
        });

        if (!userData) {
            return res.status(404).send('User not found');
        }

        let fullName = '';
        if (userData.profile && userData.profile) {
            fullName = `${userData.profile.first_name} ${userData.profile.last_name}`;
        } else {
            fullName = 'No Name';
        }
        let phone = '';
        if (userData.profile) {
            phone = `${userData.profile.phone}`;
        } else {
            phone = '';
        }

        const sanitizedUserData = {
            id: userData.id,
            email: userData.email,
            user_role: userData.user_role.name,
            user_department: userData.user_department.name,
            employmentStatus: userData.employmentStatus.status.toUpperCase()
        };


        return res.render('home', { fullName, sanitizedUserData, phone });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        return res.status(500).send('Internal Server Error');
    }
};


const logout = async (req, res) => {
    try {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { login, dashboard, logout };