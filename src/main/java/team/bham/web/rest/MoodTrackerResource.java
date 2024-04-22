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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.MoodTracker;
import team.bham.repository.MoodTrackerRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MoodTracker}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MoodTrackerResource {

    private final Logger log = LoggerFactory.getLogger(MoodTrackerResource.class);

    private static final String ENTITY_NAME = "moodTracker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MoodTrackerRepository moodTrackerRepository;

    @Autowired
    public MoodTrackerResource(MoodTrackerRepository moodTrackerRepository) {
        this.moodTrackerRepository = moodTrackerRepository;
    }

    /**
     * {@code POST  /mood-trackers} : Create a new moodTracker.
     *
     * @param moodTracker the moodTracker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new moodTracker, or with status {@code 400 (Bad Request)} if the moodTracker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mood-trackers")
    public ResponseEntity<MoodTracker> createMoodTracker(@Valid @RequestBody MoodTracker moodTracker) throws URISyntaxException {
        log.debug("REST request to save MoodTracker : {}", moodTracker);
        if (moodTracker.getId() != null) {
            throw new BadRequestAlertException("A new moodTracker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MoodTracker result = moodTrackerRepository.save(moodTracker);
        return ResponseEntity
            .created(new URI("/api/mood-trackers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mood-trackers/:id} : Updates an existing moodTracker.
     *
     * @param id the id of the moodTracker to save.
     * @param moodTracker the moodTracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moodTracker,
     * or with status {@code 400 (Bad Request)} if the moodTracker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the moodTracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mood-trackers/{id}")
    public ResponseEntity<MoodTracker> updateMoodTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MoodTracker moodTracker
    ) throws URISyntaxException {
        log.debug("REST request to update MoodTracker : {}, {}", id, moodTracker);
        if (moodTracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, moodTracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moodTrackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MoodTracker result = moodTrackerRepository.save(moodTracker);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, moodTracker.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mood-trackers/:id} : Partial updates given fields of an existing moodTracker, field will ignore if it is null
     *
     * @param id the id of the moodTracker to save.
     * @param moodTracker the moodTracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moodTracker,
     * or with status {@code 400 (Bad Request)} if the moodTracker is not valid,
     * or with status {@code 404 (Not Found)} if the moodTracker is not found,
     * or with status {@code 500 (Internal Server Error)} if the moodTracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mood-trackers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MoodTracker> partialUpdateMoodTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MoodTracker moodTracker
    ) throws URISyntaxException {
        log.debug("REST request to partial update MoodTracker partially : {}, {}", id, moodTracker);
        if (moodTracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, moodTracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!moodTrackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MoodTracker> result = moodTrackerRepository
            .findById(moodTracker.getId())
            .map(existingMoodTracker -> {
                if (moodTracker.getDate() != null) {
                    existingMoodTracker.setDate(moodTracker.getDate());
                }
                if (moodTracker.getMood() != null) {
                    existingMoodTracker.setMood(moodTracker.getMood());
                }
                if (moodTracker.getNote() != null) {
                    existingMoodTracker.setNote(moodTracker.getNote());
                }

                return existingMoodTracker;
            })
            .map(moodTrackerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, moodTracker.getId().toString())
        );
    }

    /**
     * {@code GET  /mood-trackers} : get all the moodTrackers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of moodTrackers in body.
     */
    @GetMapping("/mood-trackers")
    public List<MoodTracker> getAllMoodTrackers() {
        log.debug("REST request to get all MoodTrackers");
        return moodTrackerRepository.findAll();
    }

    /**
     * {@code GET  /mood-trackers/:id} : get the "id" moodTracker.
     *
     * @param id the id of the moodTracker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the moodTracker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mood-trackers/{id}")
    public ResponseEntity<MoodTracker> getMoodTracker(@PathVariable Long id) {
        log.debug("REST request to get MoodTracker : {}", id);
        Optional<MoodTracker> moodTracker = moodTrackerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(moodTracker);
    }

    @GetMapping("/mood-trackers/latest")
    public List<MoodTracker> getLatestMoodTrackers() {
        return moodTrackerRepository.findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"))).getContent();
    }

    @GetMapping("/stress-trackers/latest")
    public List<MoodTracker> getLatestStressEntries() {
        return moodTrackerRepository.findAll(PageRequest.of(0, 7, Sort.by(Sort.Direction.DESC, "id"))).getContent();
    }

    /**
     * {@code DELETE  /mood-trackers/:id} : delete the "id" moodTracker.
     *
     * @param id the id of the moodTracker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mood-trackers/{id}")
    public ResponseEntity<Void> deleteMoodTracker(@PathVariable Long id) {
        log.debug("REST request to delete MoodTracker : {}", id);
        moodTrackerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
