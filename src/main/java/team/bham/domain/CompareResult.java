package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CompareResult.
 */
@Entity
@Table(name = "compare_result")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CompareResult implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "result_details")
    private String resultDetails;

    @Column(name = "timestamp")
    private Instant timestamp;

    @Column(name = "dietary_goal_complete")
    private Boolean dietaryGoalComplete;

    @Column(name = "mood_goal_achieved")
    private Boolean moodGoalAchieved;

    @Column(name = "workout_goal_achieved")
    private Boolean workoutGoalAchieved;

    @Column(name = "sleep_goal_achieved")
    private Boolean sleepGoalAchieved;

    @JsonIgnoreProperties(
        value = {
            "dashboard",
            "compareResult",
            "workouts",
            "moodTrackers",
            "stressTrackers",
            "mindfulnessPractices",
            "medicines",
            "sleepRecords",
            "customGoals",
            "items",
            "energyIntakeResults",
        },
        allowSetters = true
    )
    @OneToOne(mappedBy = "compareResult")
    private UserProfile userProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CompareResult id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResultDetails() {
        return this.resultDetails;
    }

    public CompareResult resultDetails(String resultDetails) {
        this.setResultDetails(resultDetails);
        return this;
    }

    public void setResultDetails(String resultDetails) {
        this.resultDetails = resultDetails;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public CompareResult timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getDietaryGoalComplete() {
        return this.dietaryGoalComplete;
    }

    public CompareResult dietaryGoalComplete(Boolean dietaryGoalComplete) {
        this.setDietaryGoalComplete(dietaryGoalComplete);
        return this;
    }

    public void setDietaryGoalComplete(Boolean dietaryGoalComplete) {
        this.dietaryGoalComplete = dietaryGoalComplete;
    }

    public Boolean getMoodGoalAchieved() {
        return this.moodGoalAchieved;
    }

    public CompareResult moodGoalAchieved(Boolean moodGoalAchieved) {
        this.setMoodGoalAchieved(moodGoalAchieved);
        return this;
    }

    public void setMoodGoalAchieved(Boolean moodGoalAchieved) {
        this.moodGoalAchieved = moodGoalAchieved;
    }

    public Boolean getWorkoutGoalAchieved() {
        return this.workoutGoalAchieved;
    }

    public CompareResult workoutGoalAchieved(Boolean workoutGoalAchieved) {
        this.setWorkoutGoalAchieved(workoutGoalAchieved);
        return this;
    }

    public void setWorkoutGoalAchieved(Boolean workoutGoalAchieved) {
        this.workoutGoalAchieved = workoutGoalAchieved;
    }

    public Boolean getSleepGoalAchieved() {
        return this.sleepGoalAchieved;
    }

    public CompareResult sleepGoalAchieved(Boolean sleepGoalAchieved) {
        this.setSleepGoalAchieved(sleepGoalAchieved);
        return this;
    }

    public void setSleepGoalAchieved(Boolean sleepGoalAchieved) {
        this.sleepGoalAchieved = sleepGoalAchieved;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        if (this.userProfile != null) {
            this.userProfile.setCompareResult(null);
        }
        if (userProfile != null) {
            userProfile.setCompareResult(this);
        }
        this.userProfile = userProfile;
    }

    public CompareResult userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CompareResult)) {
            return false;
        }
        return id != null && id.equals(((CompareResult) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CompareResult{" +
            "id=" + getId() +
            ", resultDetails='" + getResultDetails() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            ", dietaryGoalComplete='" + getDietaryGoalComplete() + "'" +
            ", moodGoalAchieved='" + getMoodGoalAchieved() + "'" +
            ", workoutGoalAchieved='" + getWorkoutGoalAchieved() + "'" +
            ", sleepGoalAchieved='" + getSleepGoalAchieved() + "'" +
            "}";
    }
}
