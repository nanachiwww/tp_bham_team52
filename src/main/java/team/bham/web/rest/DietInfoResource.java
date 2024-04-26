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
import team.bham.domain.DietInfo;
import team.bham.repository.DietInfoRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link DietInfo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DietInfoResource {

    private final Logger log = LoggerFactory.getLogger(DietInfoResource.class);

    private static final String ENTITY_NAME = "dietInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DietInfoRepository dietInfoRepository;

    public DietInfoResource(DietInfoRepository dietInfoRepository) {
        this.dietInfoRepository = dietInfoRepository;
    }

    /**
     * {@code POST  /diet_info} : Create a new DietInfo.
     *
     * @param dietInfo the DietInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new DietInfo, or with status {@code 400 (Bad Request)} if the DietInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/diet_info")
    public ResponseEntity<DietInfo> createDietInfo(@Valid @RequestBody DietInfo dietInfo) throws URISyntaxException {
        log.debug("REST request to save DietInfo : {}", dietInfo);
        if (dietInfo.getId() != null) {
            throw new BadRequestAlertException("A new DietInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DietInfo result = dietInfoRepository.save(dietInfo);
        return ResponseEntity
            .created(new URI("/api/diet_info/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /custom-goals/:id} : Updates an existing DietInfo.
     *
     * @param id the id of the DietInfo to save.
     * @param dietInfo the DietInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated DietInfo,
     * or with status {@code 400 (Bad Request)} if the DietInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the DietInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/diet_info/{id}")
    public ResponseEntity<DietInfo> updateDietInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DietInfo dietInfo
    ) throws URISyntaxException {
        log.debug("REST request to update DietInfo : {}, {}", id, dietInfo);
        if (dietInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dietInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dietInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DietInfo result = dietInfoRepository.save(dietInfo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dietInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /custom-goals/:id} : Partial updates given fields of an existing DietInfo, field will ignore if it is null
     *
     * @param id the id of the DietInfo to save.
     * @param dietInfo the DietInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated DietInfo,
     * or with status {@code 400 (Bad Request)} if the DietInfo is not valid,
     * or with status {@code 404 (Not Found)} if the DietInfo is not found,
     * or with status {@code 500 (Internal Server Error)} if the DietInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/diet_info/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DietInfo> partialUpdateDietInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DietInfo dietInfo
    ) throws URISyntaxException {
        log.debug("REST request to partial update DietInfo partially : {}, {}", id, dietInfo);
        if (dietInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dietInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dietInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DietInfo> result = dietInfoRepository
            .findById(dietInfo.getId())
            .map(existingDietInfo -> {
                if (dietInfo.getBreakfast() != null) {
                    existingDietInfo.setBreakfast(dietInfo.getBreakfast());
                }
                if (dietInfo.getLunch() != null) {
                    existingDietInfo.setLunch(dietInfo.getLunch());
                }
                if (dietInfo.getDinner() != null) {
                    existingDietInfo.setDinner(dietInfo.getDinner());
                }
                if (dietInfo.getCreateTime() != null) {
                    existingDietInfo.setCreateTime(dietInfo.getCreateTime());
                }
                return existingDietInfo;
            })
            .map(dietInfoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dietInfo.getId().toString())
        );
    }

    /**
     * {@code GET  /custom-goals} : get all the DietInfos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of DietInfos in body.
     */
    @GetMapping("/diet_info")
    public List<DietInfo> getAllDietInfos() {
        log.debug("REST request to get all DietInfos");
        return dietInfoRepository.findAll();
    }

    /**
     * {@code GET  /custom-goals/:id} : get the "id" DietInfo.
     *
     * @param id the id of the DietInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the DietInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/diet_info/{id}")
    public ResponseEntity<DietInfo> getDietInfo(@PathVariable Long id) {
        log.debug("REST request to get DietInfo : {}", id);
        Optional<DietInfo> dietInfo = dietInfoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dietInfo);
    }

    /**
     * {@code DELETE  /custom-goals/:id} : delete the "id" dietInfo.
     *
     * @param id the id of the dietInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/diet_info/{id}")
    public ResponseEntity<Void> deleteDietInfo(@PathVariable Long id) {
        log.debug("REST request to delete DietInfo : {}", id);
        dietInfoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/diet_info/{category}")
    public ResponseEntity<DietInfo> createDietInfoInCategory(@PathVariable String category, @Valid @RequestBody DietInfo dietInfo)
        throws URISyntaxException {
        log.debug("REST request to save DietInfo in category {}: {}", category, dietInfo);
        if (dietInfo.getId() != null) {
            throw new BadRequestAlertException("A new dietInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        // 这里可以根据 category 将 DietInfo 保存到不同的处理逻辑或数据表
        DietInfo result = dietInfoRepository.save(dietInfo);
        return ResponseEntity
            .created(new URI("/api/diet_info/" + category + "/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
}
