package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.StressTracker;

/**
 * Spring Data JPA repository for the StressTracker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StressTrackerRepository extends JpaRepository<StressTracker, Long> {}
