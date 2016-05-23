#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
  int random_num = 0;
  int guessed_num = 0;
  int counter = 0;

  srand(time(NULL));
  random_num = rand() % 10 + 1;

  printf("Guess my number! ");

  while(1) {
    counter++;

    scanf("%d", &guessed_num);

    if (guessed_num == random_num) {
      printf("You guessed correctly in %d tries! Congratulations!\n", counter);
      break;
    }

    if (guessed_num < random_num)
      printf("Your guess is too low. Guess again. ");

    if (guessed_num > random_num)
      printf("Your guess is too high. Guess again. ");
  }

  return 0;
}
