package team.bham.domain;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CustomGoal.
 */
@Entity
@Table(name = "diet_info")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DietInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "breakfast", nullable = false)
    private String breakfast;

    @Column(name = "lunch")
    private String lunch;

    @Column(name = "dinner")
    private String dinner;

    @Column(name = "create_time")
    //    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    public Long getId() {
        return this.id;
    }

    public DietInfo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBreakfast() {
        return this.breakfast;
    }

    public DietInfo breakfast(String breakfast) {
        this.setBreakfast(breakfast);
        return this;
    }

    public void setBreakfast(String breakfast) {
        this.breakfast = breakfast;
    }

    public String getDinner() {
        return this.dinner;
    }

    public DietInfo description(String dinner) {
        this.setDinner(dinner);
        return this;
    }

    public void setDinner(String dinner) {
        this.dinner = dinner;
    }

    public String getLunch() {
        return this.lunch;
    }

    public DietInfo lunch(String lunch) {
        this.setLunch(lunch);
        return this;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public DietInfo createTime(Date createTime) {
        this.setCreateTime(createTime);
        return this;
    }

    public void setLunch(String lunch) {
        this.lunch = lunch;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DietInfo)) {
            return false;
        }
        return id != null && id.equals(((DietInfo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CustomGoal{" +
            "id=" + getId() +
            ", lunch='" + getLunch() + "'" +
            ", dinner='" + getDinner() + "'" +
            ", breakfast='" + getBreakfast() + "'" +
            ", createTime ='" + getCreateTime() + "'" +
            "}";
    }
}
