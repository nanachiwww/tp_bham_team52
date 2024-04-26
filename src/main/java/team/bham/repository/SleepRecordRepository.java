package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.SleepRecord;

/**
 * Spring Data JPA repository for the SleepRecord entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SleepRecordRepository extends JpaRepository<SleepRecord, Long>, JpaSpecificationExecutor<SleepRecord> {}
