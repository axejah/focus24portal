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
    emailadres: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    telefoonnummer1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    telefoonnummer2: {
      type: DataTypes.STRING,
    },
    geslacht: {
      type: DataTypes.STRING,
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
    bedrijfsnaam: {
      type: DataTypes.STRING,
    },
  });

  CustomerContact.associate = (models) => {
    CustomerContact.hasMany(models.CustomerContactAction, {
      onDelete: 'cascade',
    });

    CustomerContact.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return CustomerContact;
};
