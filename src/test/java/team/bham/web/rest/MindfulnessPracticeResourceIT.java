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
import team.bham.domain.MindfulnessPractice;
import team.bham.domain.enumeration.MindfulnessActivityType;
import team.bham.repository.MindfulnessPracticeRepository;

/**
 * Integration tests for the {@link MindfulnessPracticeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MindfulnessPracticeResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final MindfulnessActivityType DEFAULT_ACTIVITY_TYPE = MindfulnessActivityType.MEDITATION;
    private static final MindfulnessActivityType UPDATED_ACTIVITY_TYPE = MindfulnessActivityType.BREATHING_EXERCISES;

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mindfulness-practices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MindfulnessPracticeRepository mindfulnessPracticeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMindfulnessPracticeMockMvc;

    private MindfulnessPractice mindfulnessPractice;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MindfulnessPractice createEntity(EntityManager em) {
        MindfulnessPractice mindfulnessPractice = new MindfulnessPractice()
            .date(DEFAULT_DATE)
            .activityType(DEFAULT_ACTIVITY_TYPE)
            .duration(DEFAULT_DURATION)
            .note(DEFAULT_NOTE);
        return mindfulnessPractice;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MindfulnessPractice createUpdatedEntity(EntityManager em) {
        MindfulnessPractice mindfulnessPractice = new MindfulnessPractice()
            .date(UPDATED_DATE)
            .activityType(UPDATED_ACTIVITY_TYPE)
            .duration(UPDATED_DURATION)
            .note(UPDATED_NOTE);
        return mindfulnessPractice;
    }

    @BeforeEach
    public void initTest() {
        mindfulnessPractice = createEntity(em);
    }

    @Test
    @Transactional
    void createMindfulnessPractice() throws Exception {
        int databaseSizeBeforeCreate = mindfulnessPracticeRepository.findAll().size();
        // Create the MindfulnessPractice
        restMindfulnessPracticeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isCreated());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeCreate + 1);
        MindfulnessPractice testMindfulnessPractice = mindfulnessPracticeList.get(mindfulnessPracticeList.size() - 1);
        assertThat(testMindfulnessPractice.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testMindfulnessPractice.getActivityType()).isEqualTo(DEFAULT_ACTIVITY_TYPE);
        assertThat(testMindfulnessPractice.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testMindfulnessPractice.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void createMindfulnessPracticeWithExistingId() throws Exception {
        // Create the MindfulnessPractice with an existing ID
        mindfulnessPractice.setId(1L);

        int databaseSizeBeforeCreate = mindfulnessPracticeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMindfulnessPracticeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = mindfulnessPracticeRepository.findAll().size();
        // set the field null
        mindfulnessPractice.setDate(null);

        // Create the MindfulnessPractice, which fails.

        restMindfulnessPracticeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isBadRequest());

        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkActivityTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = mindfulnessPracticeRepository.findAll().size();
        // set the field null
        mindfulnessPractice.setActivityType(null);

        // Create the MindfulnessPractice, which fails.

        restMindfulnessPracticeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isBadRequest());

        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDurationIsRequired() throws Exception {
        int databaseSizeBeforeTest = mindfulnessPracticeRepository.findAll().size();
        // set the field null
        mindfulnessPractice.setDuration(null);

        // Create the MindfulnessPractice, which fails.

        restMindfulnessPracticeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isBadRequest());

        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMindfulnessPractices() throws Exception {
        // Initialize the database
        mindfulnessPracticeRepository.saveAndFlush(mindfulnessPractice);

        // Get all the mindfulnessPracticeList
        restMindfulnessPracticeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mindfulnessPractice.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].activityType").value(hasItem(DEFAULT_ACTIVITY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.toString())));
    }

    @Test
    @Transactional
    void getMindfulnessPractice() throws Exception {
        // Initialize the database
        mindfulnessPracticeRepository.saveAndFlush(mindfulnessPractice);

        // Get the mindfulnessPractice
        restMindfulnessPracticeMockMvc
            .perform(get(ENTITY_API_URL_ID, mindfulnessPractice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mindfulnessPractice.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.activityType").value(DEFAULT_ACTIVITY_TYPE.toString()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMindfulnessPractice() throws Exception {
        // Get the mindfulnessPractice
        restMindfulnessPracticeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMindfulnessPractice() throws Exception {
        // Initialize the database
        mindfulnessPracticeRepository.saveAndFlush(mindfulnessPractice);

        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();

        // Update the mindfulnessPractice
        MindfulnessPractice updatedMindfulnessPractice = mindfulnessPracticeRepository.findById(mindfulnessPractice.getId()).get();
        // Disconnect from session so that the updates on updatedMindfulnessPractice are not directly saved in db
        em.detach(updatedMindfulnessPractice);
        updatedMindfulnessPractice.date(UPDATED_DATE).activityType(UPDATED_ACTIVITY_TYPE).duration(UPDATED_DURATION).note(UPDATED_NOTE);

        restMindfulnessPracticeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMindfulnessPractice.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMindfulnessPractice))
            )
            .andExpect(status().isOk());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
        MindfulnessPractice testMindfulnessPractice = mindfulnessPracticeList.get(mindfulnessPracticeList.size() - 1);
        assertThat(testMindfulnessPractice.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMindfulnessPractice.getActivityType()).isEqualTo(UPDATED_ACTIVITY_TYPE);
        assertThat(testMindfulnessPractice.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testMindfulnessPractice.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void putNonExistingMindfulnessPractice() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();
        mindfulnessPractice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMindfulnessPracticeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mindfulnessPractice.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMindfulnessPractice() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();
        mindfulnessPractice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindfulnessPracticeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMindfulnessPractice() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();
        mindfulnessPractice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindfulnessPracticeMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMindfulnessPracticeWithPatch() throws Exception {
        // Initialize the database
        mindfulnessPracticeRepository.saveAndFlush(mindfulnessPractice);

        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();

        // Update the mindfulnessPractice using partial update
        MindfulnessPractice partialUpdatedMindfulnessPractice = new MindfulnessPractice();
        partialUpdatedMindfulnessPractice.setId(mindfulnessPractice.getId());

        partialUpdatedMindfulnessPractice.duration(UPDATED_DURATION).note(UPDATED_NOTE);

        restMindfulnessPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMindfulnessPractice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMindfulnessPractice))
            )
            .andExpect(status().isOk());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
        MindfulnessPractice testMindfulnessPractice = mindfulnessPracticeList.get(mindfulnessPracticeList.size() - 1);
        assertThat(testMindfulnessPractice.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testMindfulnessPractice.getActivityType()).isEqualTo(DEFAULT_ACTIVITY_TYPE);
        assertThat(testMindfulnessPractice.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testMindfulnessPractice.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void fullUpdateMindfulnessPracticeWithPatch() throws Exception {
        // Initialize the database
        mindfulnessPracticeRepository.saveAndFlush(mindfulnessPractice);

        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();

        // Update the mindfulnessPractice using partial update
        MindfulnessPractice partialUpdatedMindfulnessPractice = new MindfulnessPractice();
        partialUpdatedMindfulnessPractice.setId(mindfulnessPractice.getId());

        partialUpdatedMindfulnessPractice
            .date(UPDATED_DATE)
            .activityType(UPDATED_ACTIVITY_TYPE)
            .duration(UPDATED_DURATION)
            .note(UPDATED_NOTE);

        restMindfulnessPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMindfulnessPractice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMindfulnessPractice))
            )
            .andExpect(status().isOk());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
        MindfulnessPractice testMindfulnessPractice = mindfulnessPracticeList.get(mindfulnessPracticeList.size() - 1);
        assertThat(testMindfulnessPractice.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMindfulnessPractice.getActivityType()).isEqualTo(UPDATED_ACTIVITY_TYPE);
        assertThat(testMindfulnessPractice.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testMindfulnessPractice.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void patchNonExistingMindfulnessPractice() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();
        mindfulnessPractice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMindfulnessPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mindfulnessPractice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMindfulnessPractice() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();
        mindfulnessPractice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindfulnessPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMindfulnessPractice() throws Exception {
        int databaseSizeBeforeUpdate = mindfulnessPracticeRepository.findAll().size();
        mindfulnessPractice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMindfulnessPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mindfulnessPractice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MindfulnessPractice in the database
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMindfulnessPractice() throws Exception {
        // Initialize the database
        mindfulnessPracticeRepository.saveAndFlush(mindfulnessPractice);

        int databaseSizeBeforeDelete = mindfulnessPracticeRepository.findAll().size();

        // Delete the mindfulnessPractice
        restMindfulnessPracticeMockMvc
            .perform(delete(ENTITY_API_URL_ID, mindfulnessPractice.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MindfulnessPractice> mindfulnessPracticeList = mindfulnessPracticeRepository.findAll();
        assertThat(mindfulnessPracticeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
