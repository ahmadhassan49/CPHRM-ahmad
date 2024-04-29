const { Employment } = require('../models/index');
const { Op } = require('sequelize');
const createleave = async (req, res) => {
    const statuses = await Employment.findAll({
        where: {
            status: {
                [Op.notIn]: ['terminated', 'resigned']
            }
        }
    });
    await res.render('createleave', { statuses })
}
module.exports = { createleave }
