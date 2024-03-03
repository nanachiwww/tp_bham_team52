package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CustomGoal;

/**
 * Spring Data JPA repository for the CustomGoal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomGoalRepository extends JpaRepository<CustomGoal, Long> {}
