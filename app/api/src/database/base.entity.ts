import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { asUUID, UUID } from '../common/types';
import { v4 } from 'uuid';
import { AnyBrand, asBrand, Brand } from '../utils';

function generateUUIDAsBrand<B extends AnyBrand>(): B {
  return asBrand<B>(asUUID(v4()));
}

@Entity({ abstract: true })
@ObjectType({ isAbstract: true })
export abstract class BaseNodeEntity<
  T extends { id: U },
  U extends Brand<UUID, any>
> extends BaseEntity<T, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  @Field(() => ID)
  public id = generateUUIDAsBrand<U>();

  @Property({ type: 'date' })
  @Field(() => Date)
  public createdAt = new Date();

  @Property({ onUpdate: () => new Date(), type: 'date' })
  @Field(() => Date)
  public updatedAt = new Date();

  @Property({ nullable: true, type: 'Date' })
  public deletedAt: Date | null = null;

  public constructor(body = {}) {
    super();
    this.assign(body);
  }
}
