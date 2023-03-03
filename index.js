const app = require("./app");
const { PORT } = process.env;
const { generateStats } = require("./statistics/controller");
const cron = require("node-cron");
//Lancer l'application
const startApp = () => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    // Exécutez la fonction de génération de statistiques toutes les 1 minutes
    cron.schedule("*/1 * * * *", generateStats);
  });
};

startApp();
