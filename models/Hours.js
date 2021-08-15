module.exports = (sequelize, DataTypes) => {
  const Hours = sequelize.define('Hours', {
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    remarks: {
      type: DataTypes.STRING(4000),
    },
    invoice: {
      type: DataTypes.BOOLEAN,
    },
    period_start: {
      type: DataTypes.DATEONLY,
    },
    period_end: {
      type: DataTypes.DATEONLY,
    },
  });

  Hours.associate = (models) => {
    Hours.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
    Hours.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Hours;
};
