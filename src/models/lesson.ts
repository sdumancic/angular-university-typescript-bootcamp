import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import {Course} from "./course";

@Entity({
    name: 'LESSONS'
})
export class Lesson{

    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    title: string;

    @Column()
    duration: string;

    @Column()
    seqNo: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifiedAt: Date

    @ManyToOne(() => Course, course => course.lessons)
    @JoinColumn({
        name: "courseId"
    })
    course: Course;
}