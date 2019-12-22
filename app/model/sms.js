const Model = require('../../lib/model')
const Sequelize = require('sequelize')

class SmsModel extends Model {

  model() {
    return this.db().define(
      'sms', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        create_time: {
          type: Sequelize.BIGINT(11),
          defaultValue: parseInt(Date.now() / 1000)
        },
        update_time: {
          type: Sequelize.BIGINT(11),
          defaultValue: parseInt(Date.now() / 1000)
        },
        status: {
          type: Sequelize.INTEGER(2),
          defaultValue: 0
        },
        mobile: {
          type: Sequelize.STRING(64),
          defaultValue: ''
        },
        code: {
          type: Sequelize.STRING(64),
          defaultValue: ''
        },
        type: {
          type: Sequelize.INTEGER(2),
          defaultValue: 0
        },
        content: {
          type: Sequelize.TEXT,
          defaultValue: ''
        }
      }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: 'update_time',
        freezeTableName: true,
        tableName: 't_sms'
      }
    );
  }
}

module.exports = SmsModel