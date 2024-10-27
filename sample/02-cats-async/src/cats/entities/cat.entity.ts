import {
  Column,
  Entity,
  GeneratedUUidColumn,
} from '@quocanhbk17/express-cassandra';

@Entity({
  table_name: 'cats',
  key: ['id'],
  options: {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versions: {
      key: '__v1',
    },
  },
})
export class CatEntity {
  @GeneratedUUidColumn()
  id: any;

  @Column({
    type: 'text',
  })
  name: string;

  @Column({
    type: 'int',
  })
  age: number;

  @Column({
    type: 'text',
  })
  breed: string;
}
