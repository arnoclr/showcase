<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { removeHtmlTags } from "../utils/strings";
import type { GithubAPICommentsResponse } from "../external/GithubApiCommentsResponse";
import { Display } from "../utils/css";

const props = defineProps<{
  githubIssueId: number;
  bubbleColor?: {
    lightBackground: string;
    darkBackground: string;
    lightBackgroundText: string;
    darkBackgroundText: string;
  };
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

  const json = (await response.json()) as GithubAPICommentsResponse;

  state.value = {
    type: "ok",
    comments: getCommentsFromJson(json),
  };
}

function getCommentsFromJson(json: GithubAPICommentsResponse): Comment[] {
  return json.map((comment) => ({
    profilePic: comment.user.avatar_url,
    username: comment.user.login,
    textContent: removeHtmlTags(comment.body_html),
    at: new Date(comment.created_at),
  }));
}

function delayForComment(i: number): string {
  return `${1000 + Math.log10(1 + i) * 3000}ms`;
}

const customColors = computed(() => ({
  "--bubble-custom-background-color": props.bubbleColor?.lightBackground,
  "--bubble-custom-background-color-dark": props.bubbleColor?.darkBackground,
  "--bubble-custom-background-color-text":
    props.bubbleColor?.lightBackgroundText,
  "--bubble-custom-background-color-text-dark":
    props.bubbleColor?.darkBackgroundText,
}));

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <span v-if="state.type === 'error'">
    Impossible de charger les commentaires pour le moment.
  </span>
  <div
    class="transitionOnHeight"
    :aria-hidden="state.type !== 'loading'"
    :style="customColors"
  >
    <div class="overflowHidden">
      <div class="loading">
        <span>Un utilisateur est train d'écrire</span>
        <div class="bubble">
          <div class="dots">
            <div class="dot dot1"></div>
            <div class="dot dot2"></div>
            <div class="dot dot3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="transitionOnHeight"
    :aria-hidden="state.type !== 'ok'"
    :style="customColors"
  >
    <div class="overflowHidden">
      <ul v-if="state.type === 'ok'">
        <li
          v-for="(comment, i) in state.comments"
          :style="{ '--transition-delay': delayForComment(i) }"
        >
          <div></div>
          <span class="name">
            {{ comment.username }}
            <span :class="Display.OnlyForScreenReader">
              a écrit un commentaire
            </span>
          </span>
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
        <li
          :style="{
            '--transition-delay': delayForComment(state.comments.length),
          }"
        >
          <a
            target="_blank"
            :href="leaveCommentUrl"
            :emphasized="state.comments.length === 0"
          >
            Écrire un avis
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.transitionOnHeight {
  --bubble-background-color: var(--bubble-custom-background-color, #eee);
  --bubble-text-color: var(--bubble-custom-background-color-text, #000);
  --horizontal-padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.7s ease-in;
}

.transitionOnHeight[aria-hidden="true"] {
  grid-template-rows: 0fr;
}

.overflowHidden {
  overflow: hidden;
}

.loading {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 2.5rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  max-width: 60ch;
  padding: 8px var(--horizontal-padding);
  background-color: var(--bubble-background-color);
  color: var(--bubble-text-color);
  border-radius: 1.4rem;
}

.dots {
  display: flex;
  gap: 0.3rem;
}

.dot {
  width: 0.7rem;
  height: 0.7rem;
  background-color: rgba(126, 126, 126, 0.8);
  border-radius: 50%;
  animation: blink 1.4s infinite;
}

.dot2 {
  animation-delay: 0.2s;
}

.dot3 {
  animation-delay: 0.4s;
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
  height: 1.3rem;
  width: auto;
  transform: translateX(-36%);
  fill: var(--bubble-background-color);
  z-index: -1;
}

li {
  opacity: 0;
  animation: appear 0.8s cubic-bezier(0.67, 0.15, 0.34, 1.15)
    var(--transition-delay) forwards;
}

a {
  color: gray;
  margin-top: 1rem;
}

a[emphasized="false"] {
  margin-left: 3rem;
}

a[emphasized="true"] {
  display: block;
  padding: 12px 22px;
  background-color: #007aff;
  color: white;
  border-radius: 999px;
  text-decoration: none;
  border: none;
  width: fit-content;
}

@media (prefers-color-scheme: dark) {
  .transitionOnHeight {
    --bubble-background-color: #333;
  }
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

@keyframes appear {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
