const fs = require('fs');
const environment = process.env.ENV;

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  production: ${environment === 'production'},
  SUPABASEURL: "${process.env.SUPABASEURL}",
  SUPABASEAPIKEY: "${process.env.SUPABASEAPIKEY}"
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Archivo de entorno generado en ${targetPath} para el entorno ${environment}`);
});
