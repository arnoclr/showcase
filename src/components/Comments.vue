<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { removeHtmlTags } from "../utils/strings";

const props = defineProps<{
  githubIssueId: number;
}>();

interface Comment {
  profilePic: string;
  username: string;
  textContent: string;
  at: Date;
}

type State =
  | {
      type: "ok";
      comments: Comment[];
    }
  | {
      type: "loading";
    }
  | {
      type: "error";
      error: Error;
    };

const state = ref<State>({ type: "loading" });
const leaveCommentUrl = `https://github.com/arnoclr/showcase/issues/${props.githubIssueId}`;

async function fetchComments(): Promise<void> {
  // TODO: Afficher les commentaires après 2/3 jours pour les supprimer à temps en cas de spam
  // TODO: Trier l'odre pour n'afficher que les commentaires récents

  const response = await fetch(
    `https://api.github.com/repos/arnoclr/showcase/issues/${props.githubIssueId}/comments?per_page=10`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.html+json",
      },
    }
  );

  if (response.status !== 200) {
    state.value = {
      type: "error",
      error: new Error("Failed to fetch comments"),
    };
  }

  const json = (await response.json()) as GithubApiCommentsResponse;

  state.value = {
    type: "ok",
    comments: getCommentsFromJson(json),
  };
}

function getCommentsFromJson(json: GithubApiCommentsResponse): Comment[] {
  return json.map((comment) => ({
    profilePic: comment.user.avatar_url,
    username: comment.user.login,
    textContent: removeHtmlTags(comment.body_html),
    at: new Date(comment.created_at),
  }));
}

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <span v-if="state.type === 'loading'">Chargement ...</span>
  <span v-if="state.type === 'error'">
    Impossible de charger les commentaires pour le moment.
  </span>
  <ul v-if="state.type === 'ok'">
    <li v-for="comment in state.comments">
      <div></div>
      <span class="name">{{ comment.username }}</span>
      <img :src="comment.profilePic" aria-hidden="true" alt="" />
      <div class="bubble">
        <span>{{ comment.textContent }}</span>
        <svg
          class="arrow"
          aria-hidden="true"
          width="20"
          height="24"
          viewBox="0 0 20 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.85352 16.6458V0C14.2517 0.761574 19.2552 1.84675 19.2559 12.7292C19.2565 22.8472 6.85353 23.5 -0.000638962 23.5C4.24201 23.5 6.85352 21.2153 6.85352 16.6458Z"
          />
        </svg>
      </div>
    </li>
    <li>
      <a target="_blank" :href="leaveCommentUrl">Écrire un avis</a>
    </li>
  </ul>
</template>

<style scoped>
ul {
  --bubble-background-color: #eee;
  --horizontal-padding: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.name {
  margin-left: var(--horizontal-padding);
  opacity: 0.5;
  font-size: 0.7rem;
}

li {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: end;
  column-gap: 0.5rem;
  row-gap: 0.4rem;
}

.bubble {
  position: relative;
  width: fit-content;
  max-width: 600px;
  padding: 8px var(--horizontal-padding);
  background-color: var(--bubble-background-color);
  border-radius: 1.4rem;
}

img {
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
}

.arrow {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 50%;
  width: auto;
  transform: translateX(-36%);
  fill: var(--bubble-background-color);
}

a {
  color: gray;
  margin-top: 1rem;
  margin-left: 3rem;
}
</style>
