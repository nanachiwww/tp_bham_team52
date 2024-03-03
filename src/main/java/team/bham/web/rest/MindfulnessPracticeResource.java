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
import team.bham.domain.MindfulnessPractice;
import team.bham.repository.MindfulnessPracticeRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MindfulnessPractice}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MindfulnessPracticeResource {

    private final Logger log = LoggerFactory.getLogger(MindfulnessPracticeResource.class);

    private static final String ENTITY_NAME = "mindfulnessPractice";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MindfulnessPracticeRepository mindfulnessPracticeRepository;

    public MindfulnessPracticeResource(MindfulnessPracticeRepository mindfulnessPracticeRepository) {
        this.mindfulnessPracticeRepository = mindfulnessPracticeRepository;
    }

    /**
     * {@code POST  /mindfulness-practices} : Create a new mindfulnessPractice.
     *
     * @param mindfulnessPractice the mindfulnessPractice to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mindfulnessPractice, or with status {@code 400 (Bad Request)} if the mindfulnessPractice has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mindfulness-practices")
    public ResponseEntity<MindfulnessPractice> createMindfulnessPractice(@Valid @RequestBody MindfulnessPractice mindfulnessPractice)
        throws URISyntaxException {
        log.debug("REST request to save MindfulnessPractice : {}", mindfulnessPractice);
        if (mindfulnessPractice.getId() != null) {
            throw new BadRequestAlertException("A new mindfulnessPractice cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MindfulnessPractice result = mindfulnessPracticeRepository.save(mindfulnessPractice);
        return ResponseEntity
            .created(new URI("/api/mindfulness-practices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mindfulness-practices/:id} : Updates an existing mindfulnessPractice.
     *
     * @param id the id of the mindfulnessPractice to save.
     * @param mindfulnessPractice the mindfulnessPractice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mindfulnessPractice,
     * or with status {@code 400 (Bad Request)} if the mindfulnessPractice is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mindfulnessPractice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mindfulness-practices/{id}")
    public ResponseEntity<MindfulnessPractice> updateMindfulnessPractice(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MindfulnessPractice mindfulnessPractice
    ) throws URISyntaxException {
        log.debug("REST request to update MindfulnessPractice : {}, {}", id, mindfulnessPractice);
        if (mindfulnessPractice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mindfulnessPractice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mindfulnessPracticeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MindfulnessPractice result = mindfulnessPracticeRepository.save(mindfulnessPractice);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mindfulnessPractice.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mindfulness-practices/:id} : Partial updates given fields of an existing mindfulnessPractice, field will ignore if it is null
     *
     * @param id the id of the mindfulnessPractice to save.
     * @param mindfulnessPractice the mindfulnessPractice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mindfulnessPractice,
     * or with status {@code 400 (Bad Request)} if the mindfulnessPractice is not valid,
     * or with status {@code 404 (Not Found)} if the mindfulnessPractice is not found,
     * or with status {@code 500 (Internal Server Error)} if the mindfulnessPractice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mindfulness-practices/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MindfulnessPractice> partialUpdateMindfulnessPractice(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MindfulnessPractice mindfulnessPractice
    ) throws URISyntaxException {
        log.debug("REST request to partial update MindfulnessPractice partially : {}, {}", id, mindfulnessPractice);
        if (mindfulnessPractice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mindfulnessPractice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mindfulnessPracticeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MindfulnessPractice> result = mindfulnessPracticeRepository
            .findById(mindfulnessPractice.getId())
            .map(existingMindfulnessPractice -> {
                if (mindfulnessPractice.getDate() != null) {
                    existingMindfulnessPractice.setDate(mindfulnessPractice.getDate());
                }
                if (mindfulnessPractice.getActivityType() != null) {
                    existingMindfulnessPractice.setActivityType(mindfulnessPractice.getActivityType());
                }
                if (mindfulnessPractice.getDuration() != null) {
                    existingMindfulnessPractice.setDuration(mindfulnessPractice.getDuration());
                }
                if (mindfulnessPractice.getNote() != null) {
                    existingMindfulnessPractice.setNote(mindfulnessPractice.getNote());
                }

                return existingMindfulnessPractice;
            })
            .map(mindfulnessPracticeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mindfulnessPractice.getId().toString())
        );
    }

    /**
     * {@code GET  /mindfulness-practices} : get all the mindfulnessPractices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mindfulnessPractices in body.
     */
    @GetMapping("/mindfulness-practices")
    public List<MindfulnessPractice> getAllMindfulnessPractices() {
        log.debug("REST request to get all MindfulnessPractices");
        return mindfulnessPracticeRepository.findAll();
    }

    /**
     * {@code GET  /mindfulness-practices/:id} : get the "id" mindfulnessPractice.
     *
     * @param id the id of the mindfulnessPractice to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mindfulnessPractice, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mindfulness-practices/{id}")
    public ResponseEntity<MindfulnessPractice> getMindfulnessPractice(@PathVariable Long id) {
        log.debug("REST request to get MindfulnessPractice : {}", id);
        Optional<MindfulnessPractice> mindfulnessPractice = mindfulnessPracticeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mindfulnessPractice);
    }

    /**
     * {@code DELETE  /mindfulness-practices/:id} : delete the "id" mindfulnessPractice.
     *
     * @param id the id of the mindfulnessPractice to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mindfulness-practices/{id}")
    public ResponseEntity<Void> deleteMindfulnessPractice(@PathVariable Long id) {
        log.debug("REST request to delete MindfulnessPractice : {}", id);
        mindfulnessPracticeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
