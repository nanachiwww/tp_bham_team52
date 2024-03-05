package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.MuscleGroupEnum;

/**
 * A Exercise.
 */
@Entity
@Table(name = "exercise")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Exercise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "reps")
    private Integer reps;

    @Column(name = "sets")
    private Integer sets;

    @Enumerated(EnumType.STRING)
    @Column(name = "muscle_group")
    private MuscleGroupEnum muscleGroup;

    @OneToMany(mappedBy = "exercises")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "exercises", "userProfile" }, allowSetters = true)
    private Set<Workout> workouts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Exercise id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Exercise name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Exercise description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getReps() {
        return this.reps;
    }

    public Exercise reps(Integer reps) {
        this.setReps(reps);
        return this;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Integer getSets() {
        return this.sets;
    }

    public Exercise sets(Integer sets) {
        this.setSets(sets);
        return this;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public MuscleGroupEnum getMuscleGroup() {
        return this.muscleGroup;
    }

    public Exercise muscleGroup(MuscleGroupEnum muscleGroup) {
        this.setMuscleGroup(muscleGroup);
        return this;
    }

    public void setMuscleGroup(MuscleGroupEnum muscleGroup) {
        this.muscleGroup = muscleGroup;
    }

    public Set<Workout> getWorkouts() {
        return this.workouts;
    }

    public void setWorkouts(Set<Workout> workouts) {
        if (this.workouts != null) {
            this.workouts.forEach(i -> i.setExercises(null));
        }
        if (workouts != null) {
            workouts.forEach(i -> i.setExercises(this));
        }
        this.workouts = workouts;
    }

    public Exercise workouts(Set<Workout> workouts) {
        this.setWorkouts(workouts);
        return this;
    }

    public Exercise addWorkout(Workout workout) {
        this.workouts.add(workout);
        workout.setExercises(this);
        return this;
    }

    public Exercise removeWorkout(Workout workout) {
        this.workouts.remove(workout);
        workout.setExercises(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Exercise)) {
            return false;
        }
        return id != null && id.equals(((Exercise) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Exercise{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", reps=" + getReps() +
            ", sets=" + getSets() +
            ", muscleGroup='" + getMuscleGroup() + "'" +
            "}";
    }
}
