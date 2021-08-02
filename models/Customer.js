module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    bedrijfsnaam: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kvk_nummer: {
      type: DataTypes.INTEGER,
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
    emailadres: {
      type: DataTypes.STRING,
    },
    straat: {
      type: DataTypes.STRING,
    },
    huisnummer: {
      type: DataTypes.STRING,
    },
    postcode: {
      type: DataTypes.STRING,
    },
    plaats: {
      type: DataTypes.STRING,
    },
  });

  Customer.associate = (models) => {
    Customer.hasMany(models.CustomerContact, {
      onDelete: 'cascade',
    });
  };

  return Customer;
};
