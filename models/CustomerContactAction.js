module.exports = (sequelize, DataTypes) => {
  const CustomerContactAction = sequelize.define('CustomerContactAction', {
    actie: {
      type: DataTypes.TEXT,
    },
    datum: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
    follow_up: {
      type: DataTypes.DATE,
    },
    user: {
      type: DataTypes.STRING,
    },
  });

  CustomerContactAction.associate = (models) => {
    CustomerContactAction.belongsTo(models.CustomerContact, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return CustomerContactAction;
};
