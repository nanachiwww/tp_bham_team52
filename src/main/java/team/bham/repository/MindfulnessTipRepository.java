package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MindfulnessTip;

/**
 * Spring Data JPA repository for the MindfulnessTip entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MindfulnessTipRepository extends JpaRepository<MindfulnessTip, Long> {}
