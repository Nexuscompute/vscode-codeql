import { faker } from "@faker-js/faker";
import {
  DbConfig,
  LocalDatabase,
  LocalList,
  RemoteRepositoryList,
  SelectedDbItem,
  DB_CONFIG_VERSION,
} from "../../src/databases/config/db-config";

export function createDbConfig({
  remoteLists = [],
  remoteOwners = [],
  remoteRepos = [],
  localLists = [],
  localDbs = [],
  selected = undefined,
}: {
  remoteLists?: RemoteRepositoryList[];
  remoteOwners?: string[];
  remoteRepos?: string[];
  localLists?: LocalList[];
  localDbs?: LocalDatabase[];
  selected?: SelectedDbItem;
} = {}): DbConfig {
  return {
    version: DB_CONFIG_VERSION,
    databases: {
      variantAnalysis: {
        repositoryLists: remoteLists,
        owners: remoteOwners,
        repositories: remoteRepos,
      },
      local: {
        lists: localLists,
        databases: localDbs,
      },
    },
    selected,
  };
}

export function createLocalDbConfigItem({
  name = `database${faker.number.int()}`,
  dateAdded = faker.date.past().getTime(),
  language = `language${faker.number.int()}`,
  storagePath = `storagePath${faker.number.int()}`,
}: {
  name?: string;
  dateAdded?: number;
  language?: string;
  storagePath?: string;
} = {}): LocalDatabase {
  return {
    name,
    dateAdded,
    language,
    storagePath,
  };
}