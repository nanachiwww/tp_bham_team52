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
import team.bham.domain.MindfulnessTip;
import team.bham.repository.MindfulnessTipRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MindfulnessTip}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MindfulnessTipResource {

    private final Logger log = LoggerFactory.getLogger(MindfulnessTipResource.class);

    private static final String ENTITY_NAME = "mindfulnessTip";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MindfulnessTipRepository mindfulnessTipRepository;

    public MindfulnessTipResource(MindfulnessTipRepository mindfulnessTipRepository) {
        this.mindfulnessTipRepository = mindfulnessTipRepository;
    }

    /**
     * {@code POST  /mindfulness-tips} : Create a new mindfulnessTip.
     *
     * @param mindfulnessTip the mindfulnessTip to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mindfulnessTip, or with status {@code 400 (Bad Request)} if the mindfulnessTip has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mindfulness-tips")
    public ResponseEntity<MindfulnessTip> createMindfulnessTip(@Valid @RequestBody MindfulnessTip mindfulnessTip)
        throws URISyntaxException {
        log.debug("REST request to save MindfulnessTip : {}", mindfulnessTip);
        if (mindfulnessTip.getId() != null) {
            throw new BadRequestAlertException("A new mindfulnessTip cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MindfulnessTip result = mindfulnessTipRepository.save(mindfulnessTip);
        return ResponseEntity
            .created(new URI("/api/mindfulness-tips/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mindfulness-tips/:id} : Updates an existing mindfulnessTip.
     *
     * @param id the id of the mindfulnessTip to save.
     * @param mindfulnessTip the mindfulnessTip to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mindfulnessTip,
     * or with status {@code 400 (Bad Request)} if the mindfulnessTip is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mindfulnessTip couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mindfulness-tips/{id}")
    public ResponseEntity<MindfulnessTip> updateMindfulnessTip(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MindfulnessTip mindfulnessTip
    ) throws URISyntaxException {
        log.debug("REST request to update MindfulnessTip : {}, {}", id, mindfulnessTip);
        if (mindfulnessTip.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mindfulnessTip.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mindfulnessTipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MindfulnessTip result = mindfulnessTipRepository.save(mindfulnessTip);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mindfulnessTip.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mindfulness-tips/:id} : Partial updates given fields of an existing mindfulnessTip, field will ignore if it is null
     *
     * @param id the id of the mindfulnessTip to save.
     * @param mindfulnessTip the mindfulnessTip to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mindfulnessTip,
     * or with status {@code 400 (Bad Request)} if the mindfulnessTip is not valid,
     * or with status {@code 404 (Not Found)} if the mindfulnessTip is not found,
     * or with status {@code 500 (Internal Server Error)} if the mindfulnessTip couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mindfulness-tips/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MindfulnessTip> partialUpdateMindfulnessTip(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MindfulnessTip mindfulnessTip
    ) throws URISyntaxException {
        log.debug("REST request to partial update MindfulnessTip partially : {}, {}", id, mindfulnessTip);
        if (mindfulnessTip.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mindfulnessTip.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mindfulnessTipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MindfulnessTip> result = mindfulnessTipRepository
            .findById(mindfulnessTip.getId())
            .map(existingMindfulnessTip -> {
                if (mindfulnessTip.getCreatedDate() != null) {
                    existingMindfulnessTip.setCreatedDate(mindfulnessTip.getCreatedDate());
                }
                if (mindfulnessTip.getTitle() != null) {
                    existingMindfulnessTip.setTitle(mindfulnessTip.getTitle());
                }
                if (mindfulnessTip.getContent() != null) {
                    existingMindfulnessTip.setContent(mindfulnessTip.getContent());
                }

                return existingMindfulnessTip;
            })
            .map(mindfulnessTipRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mindfulnessTip.getId().toString())
        );
    }

    /**
     * {@code GET  /mindfulness-tips} : get all the mindfulnessTips.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mindfulnessTips in body.
     */
    @GetMapping("/mindfulness-tips")
    public List<MindfulnessTip> getAllMindfulnessTips() {
        log.debug("REST request to get all MindfulnessTips");
        return mindfulnessTipRepository.findAll();
    }

    /**
     * {@code GET  /mindfulness-tips/:id} : get the "id" mindfulnessTip.
     *
     * @param id the id of the mindfulnessTip to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mindfulnessTip, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mindfulness-tips/{id}")
    public ResponseEntity<MindfulnessTip> getMindfulnessTip(@PathVariable Long id) {
        log.debug("REST request to get MindfulnessTip : {}", id);
        Optional<MindfulnessTip> mindfulnessTip = mindfulnessTipRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mindfulnessTip);
    }

    /**
     * {@code DELETE  /mindfulness-tips/:id} : delete the "id" mindfulnessTip.
     *
     * @param id the id of the mindfulnessTip to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mindfulness-tips/{id}")
    public ResponseEntity<Void> deleteMindfulnessTip(@PathVariable Long id) {
        log.debug("REST request to delete MindfulnessTip : {}", id);
        mindfulnessTipRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
