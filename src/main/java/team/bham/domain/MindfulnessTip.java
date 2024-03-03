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
import org.hibernate.annotations.Type;

/**
 * A MindfulnessTip.
 */
@Entity
@Table(name = "mindfulness_tip")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MindfulnessTip implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "content", nullable = false)
    private String content;

    @OneToMany(mappedBy = "mindfulnessTip")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mindfulnessTip", "userProfile" }, allowSetters = true)
    private Set<MindfulnessPractice> practices = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MindfulnessTip id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public MindfulnessTip createdDate(LocalDate createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public String getTitle() {
        return this.title;
    }

    public MindfulnessTip title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return this.content;
    }

    public MindfulnessTip content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Set<MindfulnessPractice> getPractices() {
        return this.practices;
    }

    public void setPractices(Set<MindfulnessPractice> mindfulnessPractices) {
        if (this.practices != null) {
            this.practices.forEach(i -> i.setMindfulnessTip(null));
        }
        if (mindfulnessPractices != null) {
            mindfulnessPractices.forEach(i -> i.setMindfulnessTip(this));
        }
        this.practices = mindfulnessPractices;
    }

    public MindfulnessTip practices(Set<MindfulnessPractice> mindfulnessPractices) {
        this.setPractices(mindfulnessPractices);
        return this;
    }

    public MindfulnessTip addPractice(MindfulnessPractice mindfulnessPractice) {
        this.practices.add(mindfulnessPractice);
        mindfulnessPractice.setMindfulnessTip(this);
        return this;
    }

    public MindfulnessTip removePractice(MindfulnessPractice mindfulnessPractice) {
        this.practices.remove(mindfulnessPractice);
        mindfulnessPractice.setMindfulnessTip(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MindfulnessTip)) {
            return false;
        }
        return id != null && id.equals(((MindfulnessTip) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MindfulnessTip{" +
            "id=" + getId() +
            ", createdDate='" + getCreatedDate() + "'" +
            ", title='" + getTitle() + "'" +
            ", content='" + getContent() + "'" +
            "}";
    }
}
