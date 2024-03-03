package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import team.bham.domain.enumeration.MindfulnessActivityType;

/**
 * A MindfulnessPractice.
 */
@Entity
@Table(name = "mindfulness_practice")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MindfulnessPractice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private MindfulnessActivityType activityType;

    @NotNull
    @Min(value = 1)
    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "note")
    private String note;

    @ManyToOne
    @JsonIgnoreProperties(value = { "practices" }, allowSetters = true)
    private MindfulnessTip mindfulnessTip;

    @ManyToOne
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
    private UserProfile userProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MindfulnessPractice id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public MindfulnessPractice date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public MindfulnessActivityType getActivityType() {
        return this.activityType;
    }

    public MindfulnessPractice activityType(MindfulnessActivityType activityType) {
        this.setActivityType(activityType);
        return this;
    }

    public void setActivityType(MindfulnessActivityType activityType) {
        this.activityType = activityType;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public MindfulnessPractice duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getNote() {
        return this.note;
    }

    public MindfulnessPractice note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public MindfulnessTip getMindfulnessTip() {
        return this.mindfulnessTip;
    }

    public void setMindfulnessTip(MindfulnessTip mindfulnessTip) {
        this.mindfulnessTip = mindfulnessTip;
    }

    public MindfulnessPractice mindfulnessTip(MindfulnessTip mindfulnessTip) {
        this.setMindfulnessTip(mindfulnessTip);
        return this;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public MindfulnessPractice userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MindfulnessPractice)) {
            return false;
        }
        return id != null && id.equals(((MindfulnessPractice) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MindfulnessPractice{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", activityType='" + getActivityType() + "'" +
            ", duration=" + getDuration() +
            ", note='" + getNote() + "'" +
            "}";
    }
}
