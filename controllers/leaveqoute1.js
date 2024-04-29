const { Employment } = require('../models/index');
const { Op } = require('sequelize');
const leaveqoute = async (req, res) => {
    const statuses = await Employment.findAll({
        where: {
            status: {
                [Op.notIn]: ['terminated', 'resigned']
            }
        }
    });
    await res.render('leaveqoute', { statuses }
    )
}

const leaveqoute1 = async (req, res) => {
    await res.render('leaveqoute1')
}
module.exports = { leaveqoute, leaveqoute1 }