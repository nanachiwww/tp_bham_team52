package team.bham.repository;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MoodTracker;

/**
 * Spring Data JPA repository for the MoodTracker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MoodTrackerRepository extends JpaRepository<MoodTracker, Long> {
    default List<MoodTracker> findLatestMoodTrackers() {
        return findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"))).getContent();
    }
}
