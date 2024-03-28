export function checkAndCreateDatabases(couch: any, dbNames: string[]) {
    couch.listDatabases().then((dbs: string[]) => {
      dbNames.forEach(dbName => {
        if (dbs && dbs.includes(dbName)) {
          console.log(`Datenbank ${dbName} existiert bereits`);
        } else {
          couch.createDatabase(dbName).then(
            () => {
              console.log(`Datenbank ${dbName} erfolgreich erstellt`);
            },
            (err: Error) => {
              console.error(err);
            },
          );
        }
      });
    });
  }