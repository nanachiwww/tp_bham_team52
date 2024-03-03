package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EnergyIntakeResult.
 */
@Entity
@Table(name = "energy_intake_result")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EnergyIntakeResult implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "goal_complete")
    private Boolean goalComplete;

    @Column(name = "details")
    private String details;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

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

    @ManyToMany(mappedBy = "energyIntakeResults")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "energyIntakeResults", "userProfile" }, allowSetters = true)
    private Set<Item> items = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EnergyIntakeResult id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getGoalComplete() {
        return this.goalComplete;
    }

    public EnergyIntakeResult goalComplete(Boolean goalComplete) {
        this.setGoalComplete(goalComplete);
        return this;
    }

    public void setGoalComplete(Boolean goalComplete) {
        this.goalComplete = goalComplete;
    }

    public String getDetails() {
        return this.details;
    }

    public EnergyIntakeResult details(String details) {
        this.setDetails(details);
        return this;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public EnergyIntakeResult date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public EnergyIntakeResult userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public Set<Item> getItems() {
        return this.items;
    }

    public void setItems(Set<Item> items) {
        if (this.items != null) {
            this.items.forEach(i -> i.removeEnergyIntakeResults(this));
        }
        if (items != null) {
            items.forEach(i -> i.addEnergyIntakeResults(this));
        }
        this.items = items;
    }

    public EnergyIntakeResult items(Set<Item> items) {
        this.setItems(items);
        return this;
    }

    public EnergyIntakeResult addItems(Item item) {
        this.items.add(item);
        item.getEnergyIntakeResults().add(this);
        return this;
    }

    public EnergyIntakeResult removeItems(Item item) {
        this.items.remove(item);
        item.getEnergyIntakeResults().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EnergyIntakeResult)) {
            return false;
        }
        return id != null && id.equals(((EnergyIntakeResult) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EnergyIntakeResult{" +
            "id=" + getId() +
            ", goalComplete='" + getGoalComplete() + "'" +
            ", details='" + getDetails() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
