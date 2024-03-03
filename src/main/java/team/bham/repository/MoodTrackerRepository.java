package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MoodTracker;

/**
 * Spring Data JPA repository for the MoodTracker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MoodTrackerRepository extends JpaRepository<MoodTracker, Long> {}
