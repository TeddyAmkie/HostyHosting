import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Unique,
} from 'typeorm';
import { Organization } from './Organization';
import { User } from './User';
import { Component } from './Component';
import { ObjectType, Field, Int, ForbiddenError } from 'type-graphql';
import { Length, Matches } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { Lazy } from '../types';
import { OrganizationMembership, OrganizationPermission, permissionIsAtLeast } from './OrganizationMembership';
import { NAME_REGEX } from '../constants';

@Entity()
@ObjectType()
@Unique(['name', 'organization'])
export class Application extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    @Length(3, 20)
    @Matches(NAME_REGEX)
    name!: string;

    @Field()
    @Column({ default: '' })
    @Length(0, 250)
    description!: string;

    // TODO: What happens if a user deletes their account:
    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, { lazy: true })
    createdBy!: Lazy<User>;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @Field(() => Organization)
    @ManyToOne(
        () => Organization,
        organization => organization.applications,
        { lazy: true },
    )
    organization!: Lazy<Organization>;

    @Field(() => [Component])
    @OneToMany(
        () => Component,
        component => component.application,
        { lazy: true },
    )
    components!: Lazy<Component[]>;

    /**
     * Verifies that a given user has access to this applciation.
     * If they do not, it will throw.
     */
    async userHasPermission(user: User, permission?: OrganizationPermission) {
        const membership = await OrganizationMembership.findOneOrFail({
            where: {
                user,
                organization: await this.organization,
            },
        });

        if (permission && !permissionIsAtLeast(permission, membership.permission)) {
            throw new ForbiddenError();
        }
    }
}
