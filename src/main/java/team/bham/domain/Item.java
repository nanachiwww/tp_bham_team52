package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.CategoriesEnum;

/**
 * A Item.
 */
@Entity
@Table(name = "item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private CategoriesEnum category;

    @ManyToMany
    @JoinTable(
        name = "rel_item__energy_intake_results",
        joinColumns = @JoinColumn(name = "item_id"),
        inverseJoinColumns = @JoinColumn(name = "energy_intake_results_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "items" }, allowSetters = true)
    private Set<EnergyIntakeResult> energyIntakeResults = new HashSet<>();

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

    public Item id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemName() {
        return this.itemName;
    }

    public Item itemName(String itemName) {
        this.setItemName(itemName);
        return this;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public CategoriesEnum getCategory() {
        return this.category;
    }

    public Item category(CategoriesEnum category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(CategoriesEnum category) {
        this.category = category;
    }

    public Set<EnergyIntakeResult> getEnergyIntakeResults() {
        return this.energyIntakeResults;
    }

    public void setEnergyIntakeResults(Set<EnergyIntakeResult> energyIntakeResults) {
        this.energyIntakeResults = energyIntakeResults;
    }

    public Item energyIntakeResults(Set<EnergyIntakeResult> energyIntakeResults) {
        this.setEnergyIntakeResults(energyIntakeResults);
        return this;
    }

    public Item addEnergyIntakeResults(EnergyIntakeResult energyIntakeResult) {
        this.energyIntakeResults.add(energyIntakeResult);
        energyIntakeResult.getItems().add(this);
        return this;
    }

    public Item removeEnergyIntakeResults(EnergyIntakeResult energyIntakeResult) {
        this.energyIntakeResults.remove(energyIntakeResult);
        energyIntakeResult.getItems().remove(this);
        return this;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public Item userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Item)) {
            return false;
        }
        return id != null && id.equals(((Item) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Item{" +
            "id=" + getId() +
            ", itemName='" + getItemName() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}
