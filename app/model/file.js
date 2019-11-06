const Model = require('../../lib/model')
const Sequelize = require('sequelize')

class FileModel extends Model {

  model() {
    return this.db().define(
      'file', {
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
        name: {
          type: Sequelize.STRING(64),
          defaultValue: ''
        },
        md5: {
          type: Sequelize.STRING(64),
          defaultValue: ''
        },
        type: {
          type: Sequelize.STRING(32),
          defaultValue: ''
        },
        ext: {
          type: Sequelize.STRING(12),
          defaultValue: ''
        },

        size: {
          type: Sequelize.BIGINT(20),
          defaultValue: 0
        },
        step: {
          type: Sequelize.BIGINT(11),
          defaultValue: 0
        },
        chunks: {
          type: Sequelize.BIGINT(11),
          defaultValue: 1
        }
      }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: 'update_time',
        freezeTableName: true,
        tableName: 't_file'
      }
    );
  }
}

module.exports = FileModel