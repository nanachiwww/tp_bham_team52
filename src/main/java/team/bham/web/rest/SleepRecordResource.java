package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.SleepRecord;
import team.bham.repository.SleepRecordRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.SleepRecord}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SleepRecordResource {

    private final Logger log = LoggerFactory.getLogger(SleepRecordResource.class);

    private static final String ENTITY_NAME = "sleepRecord";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SleepRecordRepository sleepRecordRepository;

    public SleepRecordResource(SleepRecordRepository sleepRecordRepository) {
        this.sleepRecordRepository = sleepRecordRepository;
    }

    /**
     * {@code POST  /sleep-records} : Create a new sleepRecord.
     *
     * @param sleepRecord the sleepRecord to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sleepRecord, or with status {@code 400 (Bad Request)} if the sleepRecord has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sleep-records")
    public ResponseEntity<SleepRecord> createSleepRecord(@Valid @RequestBody SleepRecord sleepRecord) throws URISyntaxException {
        log.debug("REST request to save SleepRecord : {}", sleepRecord);
        if (sleepRecord.getId() != null) {
            throw new BadRequestAlertException("A new sleepRecord cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SleepRecord result = sleepRecordRepository.save(sleepRecord);
        return ResponseEntity
            .created(new URI("/api/sleep-records/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sleep-records/:id} : Updates an existing sleepRecord.
     *
     * @param id the id of the sleepRecord to save.
     * @param sleepRecord the sleepRecord to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sleepRecord,
     * or with status {@code 400 (Bad Request)} if the sleepRecord is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sleepRecord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sleep-records/{id}")
    public ResponseEntity<SleepRecord> updateSleepRecord(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SleepRecord sleepRecord
    ) throws URISyntaxException {
        log.debug("REST request to update SleepRecord : {}, {}", id, sleepRecord);
        if (sleepRecord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sleepRecord.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sleepRecordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SleepRecord result = sleepRecordRepository.save(sleepRecord);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sleepRecord.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sleep-records/:id} : Partial updates given fields of an existing sleepRecord, field will ignore if it is null
     *
     * @param id the id of the sleepRecord to save.
     * @param sleepRecord the sleepRecord to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sleepRecord,
     * or with status {@code 400 (Bad Request)} if the sleepRecord is not valid,
     * or with status {@code 404 (Not Found)} if the sleepRecord is not found,
     * or with status {@code 500 (Internal Server Error)} if the sleepRecord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sleep-records/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SleepRecord> partialUpdateSleepRecord(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SleepRecord sleepRecord
    ) throws URISyntaxException {
        log.debug("REST request to partial update SleepRecord partially : {}, {}", id, sleepRecord);
        if (sleepRecord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sleepRecord.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sleepRecordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SleepRecord> result = sleepRecordRepository
            .findById(sleepRecord.getId())
            .map(existingSleepRecord -> {
                if (sleepRecord.getStartTime() != null) {
                    existingSleepRecord.setStartTime(sleepRecord.getStartTime());
                }
                if (sleepRecord.getEndTime() != null) {
                    existingSleepRecord.setEndTime(sleepRecord.getEndTime());
                }
                if (sleepRecord.getRating() != null) {
                    existingSleepRecord.setRating(sleepRecord.getRating());
                }

                return existingSleepRecord;
            })
            .map(sleepRecordRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sleepRecord.getId().toString())
        );
    }

    /**
     * {@code GET  /sleep-records} : get all the sleepRecords.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sleepRecords in body.
     */
    @GetMapping("/sleep-records")
    public List<SleepRecord> getAllSleepRecords() {
        log.debug("REST request to get all SleepRecords");
        return sleepRecordRepository.findAll();
    }

    /**
     * {@code GET  /sleep-records/:id} : get the "id" sleepRecord.
     *
     * @param id the id of the sleepRecord to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sleepRecord, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sleep-records/{id}")
    public ResponseEntity<SleepRecord> getSleepRecord(@PathVariable Long id) {
        log.debug("REST request to get SleepRecord : {}", id);
        Optional<SleepRecord> sleepRecord = sleepRecordRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sleepRecord);
    }

    /**
     * {@code DELETE  /sleep-records/:id} : delete the "id" sleepRecord.
     *
     * @param id the id of the sleepRecord to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sleep-records/{id}")
    public ResponseEntity<Void> deleteSleepRecord(@PathVariable Long id) {
        log.debug("REST request to delete SleepRecord : {}", id);
        sleepRecordRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
