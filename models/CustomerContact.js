module.exports = (sequelize, DataTypes) => {
  const CustomerContact = sequelize.define('CustomerContact', {
    voornaam: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    achternaam: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    geslacht: {
      type: DataTypes.STRING,
    },
    emailadres: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    telefoonnummer1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    telefoonnummer2: {
      type: DataTypes.INTEGER,
    },
    functie: {
      type: DataTypes.STRING,
    },
    beslissingsbevoegd: {
      type: DataTypes.BOOLEAN,
    },
    remarks: {
      type: DataTypes.STRING,
    },
  });

  CustomerContact.associate = (models) => {
    CustomerContact.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return CustomerContact;
};
