import type { DataSource } from 'typeorm';

export const truncateTables = async (Connection: DataSource) => {
  const entities = Connection.entityMetadatas;
  for (const entity of entities) {
    const repository = Connection.getRepository(entity.name);
    await repository.clear();
  }
};
