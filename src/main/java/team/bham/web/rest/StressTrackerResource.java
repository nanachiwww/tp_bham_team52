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
import team.bham.domain.StressTracker;
import team.bham.repository.StressTrackerRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.StressTracker}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StressTrackerResource {

    private final Logger log = LoggerFactory.getLogger(StressTrackerResource.class);

    private static final String ENTITY_NAME = "stressTracker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StressTrackerRepository stressTrackerRepository;

    public StressTrackerResource(StressTrackerRepository stressTrackerRepository) {
        this.stressTrackerRepository = stressTrackerRepository;
    }

    /**
     * {@code POST  /stress-trackers} : Create a new stressTracker.
     *
     * @param stressTracker the stressTracker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stressTracker, or with status {@code 400 (Bad Request)} if the stressTracker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stress-trackers")
    public ResponseEntity<StressTracker> createStressTracker(@Valid @RequestBody StressTracker stressTracker) throws URISyntaxException {
        log.debug("REST request to save StressTracker : {}", stressTracker);
        if (stressTracker.getId() != null) {
            throw new BadRequestAlertException("A new stressTracker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StressTracker result = stressTrackerRepository.save(stressTracker);
        return ResponseEntity
            .created(new URI("/api/stress-trackers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stress-trackers/:id} : Updates an existing stressTracker.
     *
     * @param id the id of the stressTracker to save.
     * @param stressTracker the stressTracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stressTracker,
     * or with status {@code 400 (Bad Request)} if the stressTracker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stressTracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stress-trackers/{id}")
    public ResponseEntity<StressTracker> updateStressTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StressTracker stressTracker
    ) throws URISyntaxException {
        log.debug("REST request to update StressTracker : {}, {}", id, stressTracker);
        if (stressTracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stressTracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stressTrackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StressTracker result = stressTrackerRepository.save(stressTracker);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stressTracker.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /stress-trackers/:id} : Partial updates given fields of an existing stressTracker, field will ignore if it is null
     *
     * @param id the id of the stressTracker to save.
     * @param stressTracker the stressTracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stressTracker,
     * or with status {@code 400 (Bad Request)} if the stressTracker is not valid,
     * or with status {@code 404 (Not Found)} if the stressTracker is not found,
     * or with status {@code 500 (Internal Server Error)} if the stressTracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/stress-trackers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StressTracker> partialUpdateStressTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StressTracker stressTracker
    ) throws URISyntaxException {
        log.debug("REST request to partial update StressTracker partially : {}, {}", id, stressTracker);
        if (stressTracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stressTracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stressTrackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StressTracker> result = stressTrackerRepository
            .findById(stressTracker.getId())
            .map(existingStressTracker -> {
                if (stressTracker.getDate() != null) {
                    existingStressTracker.setDate(stressTracker.getDate());
                }
                if (stressTracker.getLevel() != null) {
                    existingStressTracker.setLevel(stressTracker.getLevel());
                }
                if (stressTracker.getNote() != null) {
                    existingStressTracker.setNote(stressTracker.getNote());
                }

                return existingStressTracker;
            })
            .map(stressTrackerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stressTracker.getId().toString())
        );
    }

    /**
     * {@code GET  /stress-trackers} : get all the stressTrackers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stressTrackers in body.
     */
    @GetMapping("/stress-trackers")
    public List<StressTracker> getAllStressTrackers() {
        log.debug("REST request to get all StressTrackers");
        return stressTrackerRepository.findAll();
    }

    /**
     * {@code GET  /stress-trackers/:id} : get the "id" stressTracker.
     *
     * @param id the id of the stressTracker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stressTracker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stress-trackers/{id}")
    public ResponseEntity<StressTracker> getStressTracker(@PathVariable Long id) {
        log.debug("REST request to get StressTracker : {}", id);
        Optional<StressTracker> stressTracker = stressTrackerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stressTracker);
    }

    /**
     * {@code DELETE  /stress-trackers/:id} : delete the "id" stressTracker.
     *
     * @param id the id of the stressTracker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stress-trackers/{id}")
    public ResponseEntity<Void> deleteStressTracker(@PathVariable Long id) {
        log.debug("REST request to delete StressTracker : {}", id);
        stressTrackerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
