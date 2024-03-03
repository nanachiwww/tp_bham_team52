package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Gender;

/**
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @NotNull
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotNull
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "age")
    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @OneToOne
    @JoinColumn(unique = true)
    private Dashboard dashboard;

    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private CompareResult compareResult;

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "exercises", "userProfile" }, allowSetters = true)
    private Set<Workout> workouts = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Set<MoodTracker> moodTrackers = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Set<StressTracker> stressTrackers = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mindfulnessTip", "userProfile" }, allowSetters = true)
    private Set<MindfulnessPractice> mindfulnessPractices = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Set<Medicine> medicines = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Set<SleepRecord> sleepRecords = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Set<CustomGoal> customGoals = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "energyIntakeResults", "userProfile" }, allowSetters = true)
    private Set<Item> items = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "items" }, allowSetters = true)
    private Set<EnergyIntakeResult> energyIntakeResults = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public UserProfile username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public UserProfile email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public UserProfile password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return this.name;
    }

    public UserProfile name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return this.age;
    }

    public UserProfile age(Integer age) {
        this.setAge(age);
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Gender getGender() {
        return this.gender;
    }

    public UserProfile gender(Gender gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Dashboard getDashboard() {
        return this.dashboard;
    }

    public void setDashboard(Dashboard dashboard) {
        this.dashboard = dashboard;
    }

    public UserProfile dashboard(Dashboard dashboard) {
        this.setDashboard(dashboard);
        return this;
    }

    public CompareResult getCompareResult() {
        return this.compareResult;
    }

    public void setCompareResult(CompareResult compareResult) {
        this.compareResult = compareResult;
    }

    public UserProfile compareResult(CompareResult compareResult) {
        this.setCompareResult(compareResult);
        return this;
    }

    public Set<Workout> getWorkouts() {
        return this.workouts;
    }

    public void setWorkouts(Set<Workout> workouts) {
        if (this.workouts != null) {
            this.workouts.forEach(i -> i.setUserProfile(null));
        }
        if (workouts != null) {
            workouts.forEach(i -> i.setUserProfile(this));
        }
        this.workouts = workouts;
    }

    public UserProfile workouts(Set<Workout> workouts) {
        this.setWorkouts(workouts);
        return this;
    }

    public UserProfile addWorkouts(Workout workout) {
        this.workouts.add(workout);
        workout.setUserProfile(this);
        return this;
    }

    public UserProfile removeWorkouts(Workout workout) {
        this.workouts.remove(workout);
        workout.setUserProfile(null);
        return this;
    }

    public Set<MoodTracker> getMoodTrackers() {
        return this.moodTrackers;
    }

    public void setMoodTrackers(Set<MoodTracker> moodTrackers) {
        if (this.moodTrackers != null) {
            this.moodTrackers.forEach(i -> i.setUserProfile(null));
        }
        if (moodTrackers != null) {
            moodTrackers.forEach(i -> i.setUserProfile(this));
        }
        this.moodTrackers = moodTrackers;
    }

    public UserProfile moodTrackers(Set<MoodTracker> moodTrackers) {
        this.setMoodTrackers(moodTrackers);
        return this;
    }

    public UserProfile addMoodTrackers(MoodTracker moodTracker) {
        this.moodTrackers.add(moodTracker);
        moodTracker.setUserProfile(this);
        return this;
    }

    public UserProfile removeMoodTrackers(MoodTracker moodTracker) {
        this.moodTrackers.remove(moodTracker);
        moodTracker.setUserProfile(null);
        return this;
    }

    public Set<StressTracker> getStressTrackers() {
        return this.stressTrackers;
    }

    public void setStressTrackers(Set<StressTracker> stressTrackers) {
        if (this.stressTrackers != null) {
            this.stressTrackers.forEach(i -> i.setUserProfile(null));
        }
        if (stressTrackers != null) {
            stressTrackers.forEach(i -> i.setUserProfile(this));
        }
        this.stressTrackers = stressTrackers;
    }

    public UserProfile stressTrackers(Set<StressTracker> stressTrackers) {
        this.setStressTrackers(stressTrackers);
        return this;
    }

    public UserProfile addStressTrackers(StressTracker stressTracker) {
        this.stressTrackers.add(stressTracker);
        stressTracker.setUserProfile(this);
        return this;
    }

    public UserProfile removeStressTrackers(StressTracker stressTracker) {
        this.stressTrackers.remove(stressTracker);
        stressTracker.setUserProfile(null);
        return this;
    }

    public Set<MindfulnessPractice> getMindfulnessPractices() {
        return this.mindfulnessPractices;
    }

    public void setMindfulnessPractices(Set<MindfulnessPractice> mindfulnessPractices) {
        if (this.mindfulnessPractices != null) {
            this.mindfulnessPractices.forEach(i -> i.setUserProfile(null));
        }
        if (mindfulnessPractices != null) {
            mindfulnessPractices.forEach(i -> i.setUserProfile(this));
        }
        this.mindfulnessPractices = mindfulnessPractices;
    }

    public UserProfile mindfulnessPractices(Set<MindfulnessPractice> mindfulnessPractices) {
        this.setMindfulnessPractices(mindfulnessPractices);
        return this;
    }

    public UserProfile addMindfulnessPractices(MindfulnessPractice mindfulnessPractice) {
        this.mindfulnessPractices.add(mindfulnessPractice);
        mindfulnessPractice.setUserProfile(this);
        return this;
    }

    public UserProfile removeMindfulnessPractices(MindfulnessPractice mindfulnessPractice) {
        this.mindfulnessPractices.remove(mindfulnessPractice);
        mindfulnessPractice.setUserProfile(null);
        return this;
    }

    public Set<Medicine> getMedicines() {
        return this.medicines;
    }

    public void setMedicines(Set<Medicine> medicines) {
        if (this.medicines != null) {
            this.medicines.forEach(i -> i.setUserProfile(null));
        }
        if (medicines != null) {
            medicines.forEach(i -> i.setUserProfile(this));
        }
        this.medicines = medicines;
    }

    public UserProfile medicines(Set<Medicine> medicines) {
        this.setMedicines(medicines);
        return this;
    }

    public UserProfile addMedicines(Medicine medicine) {
        this.medicines.add(medicine);
        medicine.setUserProfile(this);
        return this;
    }

    public UserProfile removeMedicines(Medicine medicine) {
        this.medicines.remove(medicine);
        medicine.setUserProfile(null);
        return this;
    }

    public Set<SleepRecord> getSleepRecords() {
        return this.sleepRecords;
    }

    public void setSleepRecords(Set<SleepRecord> sleepRecords) {
        if (this.sleepRecords != null) {
            this.sleepRecords.forEach(i -> i.setUserProfile(null));
        }
        if (sleepRecords != null) {
            sleepRecords.forEach(i -> i.setUserProfile(this));
        }
        this.sleepRecords = sleepRecords;
    }

    public UserProfile sleepRecords(Set<SleepRecord> sleepRecords) {
        this.setSleepRecords(sleepRecords);
        return this;
    }

    public UserProfile addSleepRecords(SleepRecord sleepRecord) {
        this.sleepRecords.add(sleepRecord);
        sleepRecord.setUserProfile(this);
        return this;
    }

    public UserProfile removeSleepRecords(SleepRecord sleepRecord) {
        this.sleepRecords.remove(sleepRecord);
        sleepRecord.setUserProfile(null);
        return this;
    }

    public Set<CustomGoal> getCustomGoals() {
        return this.customGoals;
    }

    public void setCustomGoals(Set<CustomGoal> customGoals) {
        if (this.customGoals != null) {
            this.customGoals.forEach(i -> i.setUserProfile(null));
        }
        if (customGoals != null) {
            customGoals.forEach(i -> i.setUserProfile(this));
        }
        this.customGoals = customGoals;
    }

    public UserProfile customGoals(Set<CustomGoal> customGoals) {
        this.setCustomGoals(customGoals);
        return this;
    }

    public UserProfile addCustomGoals(CustomGoal customGoal) {
        this.customGoals.add(customGoal);
        customGoal.setUserProfile(this);
        return this;
    }

    public UserProfile removeCustomGoals(CustomGoal customGoal) {
        this.customGoals.remove(customGoal);
        customGoal.setUserProfile(null);
        return this;
    }

    public Set<Item> getItems() {
        return this.items;
    }

    public void setItems(Set<Item> items) {
        if (this.items != null) {
            this.items.forEach(i -> i.setUserProfile(null));
        }
        if (items != null) {
            items.forEach(i -> i.setUserProfile(this));
        }
        this.items = items;
    }

    public UserProfile items(Set<Item> items) {
        this.setItems(items);
        return this;
    }

    public UserProfile addItems(Item item) {
        this.items.add(item);
        item.setUserProfile(this);
        return this;
    }

    public UserProfile removeItems(Item item) {
        this.items.remove(item);
        item.setUserProfile(null);
        return this;
    }

    public Set<EnergyIntakeResult> getEnergyIntakeResults() {
        return this.energyIntakeResults;
    }

    public void setEnergyIntakeResults(Set<EnergyIntakeResult> energyIntakeResults) {
        if (this.energyIntakeResults != null) {
            this.energyIntakeResults.forEach(i -> i.setUserProfile(null));
        }
        if (energyIntakeResults != null) {
            energyIntakeResults.forEach(i -> i.setUserProfile(this));
        }
        this.energyIntakeResults = energyIntakeResults;
    }

    public UserProfile energyIntakeResults(Set<EnergyIntakeResult> energyIntakeResults) {
        this.setEnergyIntakeResults(energyIntakeResults);
        return this;
    }

    public UserProfile addEnergyIntakeResults(EnergyIntakeResult energyIntakeResult) {
        this.energyIntakeResults.add(energyIntakeResult);
        energyIntakeResult.setUserProfile(this);
        return this;
    }

    public UserProfile removeEnergyIntakeResults(EnergyIntakeResult energyIntakeResult) {
        this.energyIntakeResults.remove(energyIntakeResult);
        energyIntakeResult.setUserProfile(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfile)) {
            return false;
        }
        return id != null && id.equals(((UserProfile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", email='" + getEmail() + "'" +
            ", password='" + getPassword() + "'" +
            ", name='" + getName() + "'" +
            ", age=" + getAge() +
            ", gender='" + getGender() + "'" +
            "}";
    }
}
