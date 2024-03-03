package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.StressTracker;
import team.bham.repository.StressTrackerRepository;

/**
 * Integration tests for the {@link StressTrackerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StressTrackerResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_LEVEL = 1;
    private static final Integer UPDATED_LEVEL = 2;

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/stress-trackers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StressTrackerRepository stressTrackerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStressTrackerMockMvc;

    private StressTracker stressTracker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StressTracker createEntity(EntityManager em) {
        StressTracker stressTracker = new StressTracker().date(DEFAULT_DATE).level(DEFAULT_LEVEL).note(DEFAULT_NOTE);
        return stressTracker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StressTracker createUpdatedEntity(EntityManager em) {
        StressTracker stressTracker = new StressTracker().date(UPDATED_DATE).level(UPDATED_LEVEL).note(UPDATED_NOTE);
        return stressTracker;
    }

    @BeforeEach
    public void initTest() {
        stressTracker = createEntity(em);
    }

    @Test
    @Transactional
    void createStressTracker() throws Exception {
        int databaseSizeBeforeCreate = stressTrackerRepository.findAll().size();
        // Create the StressTracker
        restStressTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stressTracker)))
            .andExpect(status().isCreated());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeCreate + 1);
        StressTracker testStressTracker = stressTrackerList.get(stressTrackerList.size() - 1);
        assertThat(testStressTracker.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testStressTracker.getLevel()).isEqualTo(DEFAULT_LEVEL);
        assertThat(testStressTracker.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void createStressTrackerWithExistingId() throws Exception {
        // Create the StressTracker with an existing ID
        stressTracker.setId(1L);

        int databaseSizeBeforeCreate = stressTrackerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStressTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stressTracker)))
            .andExpect(status().isBadRequest());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = stressTrackerRepository.findAll().size();
        // set the field null
        stressTracker.setDate(null);

        // Create the StressTracker, which fails.

        restStressTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stressTracker)))
            .andExpect(status().isBadRequest());

        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLevelIsRequired() throws Exception {
        int databaseSizeBeforeTest = stressTrackerRepository.findAll().size();
        // set the field null
        stressTracker.setLevel(null);

        // Create the StressTracker, which fails.

        restStressTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stressTracker)))
            .andExpect(status().isBadRequest());

        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStressTrackers() throws Exception {
        // Initialize the database
        stressTrackerRepository.saveAndFlush(stressTracker);

        // Get all the stressTrackerList
        restStressTrackerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stressTracker.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL)))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.toString())));
    }

    @Test
    @Transactional
    void getStressTracker() throws Exception {
        // Initialize the database
        stressTrackerRepository.saveAndFlush(stressTracker);

        // Get the stressTracker
        restStressTrackerMockMvc
            .perform(get(ENTITY_API_URL_ID, stressTracker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stressTracker.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingStressTracker() throws Exception {
        // Get the stressTracker
        restStressTrackerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStressTracker() throws Exception {
        // Initialize the database
        stressTrackerRepository.saveAndFlush(stressTracker);

        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();

        // Update the stressTracker
        StressTracker updatedStressTracker = stressTrackerRepository.findById(stressTracker.getId()).get();
        // Disconnect from session so that the updates on updatedStressTracker are not directly saved in db
        em.detach(updatedStressTracker);
        updatedStressTracker.date(UPDATED_DATE).level(UPDATED_LEVEL).note(UPDATED_NOTE);

        restStressTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStressTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStressTracker))
            )
            .andExpect(status().isOk());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
        StressTracker testStressTracker = stressTrackerList.get(stressTrackerList.size() - 1);
        assertThat(testStressTracker.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testStressTracker.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testStressTracker.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void putNonExistingStressTracker() throws Exception {
        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();
        stressTracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStressTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stressTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stressTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStressTracker() throws Exception {
        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();
        stressTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStressTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stressTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStressTracker() throws Exception {
        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();
        stressTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStressTrackerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stressTracker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStressTrackerWithPatch() throws Exception {
        // Initialize the database
        stressTrackerRepository.saveAndFlush(stressTracker);

        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();

        // Update the stressTracker using partial update
        StressTracker partialUpdatedStressTracker = new StressTracker();
        partialUpdatedStressTracker.setId(stressTracker.getId());

        partialUpdatedStressTracker.date(UPDATED_DATE);

        restStressTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStressTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStressTracker))
            )
            .andExpect(status().isOk());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
        StressTracker testStressTracker = stressTrackerList.get(stressTrackerList.size() - 1);
        assertThat(testStressTracker.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testStressTracker.getLevel()).isEqualTo(DEFAULT_LEVEL);
        assertThat(testStressTracker.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void fullUpdateStressTrackerWithPatch() throws Exception {
        // Initialize the database
        stressTrackerRepository.saveAndFlush(stressTracker);

        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();

        // Update the stressTracker using partial update
        StressTracker partialUpdatedStressTracker = new StressTracker();
        partialUpdatedStressTracker.setId(stressTracker.getId());

        partialUpdatedStressTracker.date(UPDATED_DATE).level(UPDATED_LEVEL).note(UPDATED_NOTE);

        restStressTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStressTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStressTracker))
            )
            .andExpect(status().isOk());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
        StressTracker testStressTracker = stressTrackerList.get(stressTrackerList.size() - 1);
        assertThat(testStressTracker.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testStressTracker.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testStressTracker.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void patchNonExistingStressTracker() throws Exception {
        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();
        stressTracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStressTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stressTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stressTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStressTracker() throws Exception {
        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();
        stressTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStressTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stressTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStressTracker() throws Exception {
        int databaseSizeBeforeUpdate = stressTrackerRepository.findAll().size();
        stressTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStressTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(stressTracker))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StressTracker in the database
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStressTracker() throws Exception {
        // Initialize the database
        stressTrackerRepository.saveAndFlush(stressTracker);

        int databaseSizeBeforeDelete = stressTrackerRepository.findAll().size();

        // Delete the stressTracker
        restStressTrackerMockMvc
            .perform(delete(ENTITY_API_URL_ID, stressTracker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StressTracker> stressTrackerList = stressTrackerRepository.findAll();
        assertThat(stressTrackerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
