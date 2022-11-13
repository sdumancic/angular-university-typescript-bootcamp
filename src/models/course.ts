import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'
import {Lesson} from "./lesson";

@Entity({
    name: 'COURSES'
})
export class Course{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seqNo: number;

    @Column()
    url: string;

    @Column()
    title: string;

    @Column()
    iconUrl: string;
    @Column()
    longDescription: string;
    @Column()
    category: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifiedAt: Date

    @OneToMany(() => Lesson, lesson => lesson.course)
    lessons: Lesson[]
}