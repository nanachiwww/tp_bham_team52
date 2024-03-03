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
import team.bham.domain.MoodTracker;
import team.bham.domain.enumeration.Mood;
import team.bham.repository.MoodTrackerRepository;

/**
 * Integration tests for the {@link MoodTrackerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MoodTrackerResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Mood DEFAULT_MOOD = Mood.VERY_HAPPY;
    private static final Mood UPDATED_MOOD = Mood.HAPPY;

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mood-trackers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MoodTrackerRepository moodTrackerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMoodTrackerMockMvc;

    private MoodTracker moodTracker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoodTracker createEntity(EntityManager em) {
        MoodTracker moodTracker = new MoodTracker().date(DEFAULT_DATE).mood(DEFAULT_MOOD).note(DEFAULT_NOTE);
        return moodTracker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoodTracker createUpdatedEntity(EntityManager em) {
        MoodTracker moodTracker = new MoodTracker().date(UPDATED_DATE).mood(UPDATED_MOOD).note(UPDATED_NOTE);
        return moodTracker;
    }

    @BeforeEach
    public void initTest() {
        moodTracker = createEntity(em);
    }

    @Test
    @Transactional
    void createMoodTracker() throws Exception {
        int databaseSizeBeforeCreate = moodTrackerRepository.findAll().size();
        // Create the MoodTracker
        restMoodTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodTracker)))
            .andExpect(status().isCreated());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeCreate + 1);
        MoodTracker testMoodTracker = moodTrackerList.get(moodTrackerList.size() - 1);
        assertThat(testMoodTracker.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testMoodTracker.getMood()).isEqualTo(DEFAULT_MOOD);
        assertThat(testMoodTracker.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    @Transactional
    void createMoodTrackerWithExistingId() throws Exception {
        // Create the MoodTracker with an existing ID
        moodTracker.setId(1L);

        int databaseSizeBeforeCreate = moodTrackerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMoodTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodTracker)))
            .andExpect(status().isBadRequest());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = moodTrackerRepository.findAll().size();
        // set the field null
        moodTracker.setDate(null);

        // Create the MoodTracker, which fails.

        restMoodTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodTracker)))
            .andExpect(status().isBadRequest());

        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMoodIsRequired() throws Exception {
        int databaseSizeBeforeTest = moodTrackerRepository.findAll().size();
        // set the field null
        moodTracker.setMood(null);

        // Create the MoodTracker, which fails.

        restMoodTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodTracker)))
            .andExpect(status().isBadRequest());

        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMoodTrackers() throws Exception {
        // Initialize the database
        moodTrackerRepository.saveAndFlush(moodTracker);

        // Get all the moodTrackerList
        restMoodTrackerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(moodTracker.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].mood").value(hasItem(DEFAULT_MOOD.toString())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.toString())));
    }

    @Test
    @Transactional
    void getMoodTracker() throws Exception {
        // Initialize the database
        moodTrackerRepository.saveAndFlush(moodTracker);

        // Get the moodTracker
        restMoodTrackerMockMvc
            .perform(get(ENTITY_API_URL_ID, moodTracker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(moodTracker.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.mood").value(DEFAULT_MOOD.toString()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMoodTracker() throws Exception {
        // Get the moodTracker
        restMoodTrackerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMoodTracker() throws Exception {
        // Initialize the database
        moodTrackerRepository.saveAndFlush(moodTracker);

        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();

        // Update the moodTracker
        MoodTracker updatedMoodTracker = moodTrackerRepository.findById(moodTracker.getId()).get();
        // Disconnect from session so that the updates on updatedMoodTracker are not directly saved in db
        em.detach(updatedMoodTracker);
        updatedMoodTracker.date(UPDATED_DATE).mood(UPDATED_MOOD).note(UPDATED_NOTE);

        restMoodTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMoodTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMoodTracker))
            )
            .andExpect(status().isOk());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
        MoodTracker testMoodTracker = moodTrackerList.get(moodTrackerList.size() - 1);
        assertThat(testMoodTracker.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMoodTracker.getMood()).isEqualTo(UPDATED_MOOD);
        assertThat(testMoodTracker.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void putNonExistingMoodTracker() throws Exception {
        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();
        moodTracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, moodTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moodTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMoodTracker() throws Exception {
        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();
        moodTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moodTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMoodTracker() throws Exception {
        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();
        moodTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodTrackerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moodTracker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMoodTrackerWithPatch() throws Exception {
        // Initialize the database
        moodTrackerRepository.saveAndFlush(moodTracker);

        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();

        // Update the moodTracker using partial update
        MoodTracker partialUpdatedMoodTracker = new MoodTracker();
        partialUpdatedMoodTracker.setId(moodTracker.getId());

        partialUpdatedMoodTracker.date(UPDATED_DATE).note(UPDATED_NOTE);

        restMoodTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMoodTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMoodTracker))
            )
            .andExpect(status().isOk());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
        MoodTracker testMoodTracker = moodTrackerList.get(moodTrackerList.size() - 1);
        assertThat(testMoodTracker.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMoodTracker.getMood()).isEqualTo(DEFAULT_MOOD);
        assertThat(testMoodTracker.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void fullUpdateMoodTrackerWithPatch() throws Exception {
        // Initialize the database
        moodTrackerRepository.saveAndFlush(moodTracker);

        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();

        // Update the moodTracker using partial update
        MoodTracker partialUpdatedMoodTracker = new MoodTracker();
        partialUpdatedMoodTracker.setId(moodTracker.getId());

        partialUpdatedMoodTracker.date(UPDATED_DATE).mood(UPDATED_MOOD).note(UPDATED_NOTE);

        restMoodTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMoodTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMoodTracker))
            )
            .andExpect(status().isOk());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
        MoodTracker testMoodTracker = moodTrackerList.get(moodTrackerList.size() - 1);
        assertThat(testMoodTracker.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMoodTracker.getMood()).isEqualTo(UPDATED_MOOD);
        assertThat(testMoodTracker.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    @Transactional
    void patchNonExistingMoodTracker() throws Exception {
        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();
        moodTracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, moodTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moodTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMoodTracker() throws Exception {
        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();
        moodTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moodTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMoodTracker() throws Exception {
        int databaseSizeBeforeUpdate = moodTrackerRepository.findAll().size();
        moodTracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMoodTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(moodTracker))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MoodTracker in the database
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMoodTracker() throws Exception {
        // Initialize the database
        moodTrackerRepository.saveAndFlush(moodTracker);

        int databaseSizeBeforeDelete = moodTrackerRepository.findAll().size();

        // Delete the moodTracker
        restMoodTrackerMockMvc
            .perform(delete(ENTITY_API_URL_ID, moodTracker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MoodTracker> moodTrackerList = moodTrackerRepository.findAll();
        assertThat(moodTrackerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
